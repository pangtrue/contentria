#!/bin/bash

# ----------------------------------------------------------------------
# 1. 설정 영역 (Configuration)
# ----------------------------------------------------------------------
# 허용된 Spring Batch Job 이름 목록 (필요 시 이곳에 추가)
ALLOWED_JOBS=("dailyStatisticsJob" "monthlyStatisticsJob" "userSyncJob")

# Job 이름 미입력 시 사용할 기본값 (이전 코드의 Job 빈 이름 적용)
DEFAULT_JOB="dailyStatisticsJob"

# ----------------------------------------------------------------------
# 2. 함수: Usage (사용법) 출력
# ----------------------------------------------------------------------
print_usage() {
  echo -e "\n🛑 사용법: $0 <FROM_DATE> <TO_DATE> [JOB_NAME]"
  echo -e "\n매개변수:"
  echo "  FROM_DATE   백필 시작 일자 (형식: YYYY-MM-DD)"
  echo "  TO_DATE     백필 종료 일자 (형식: YYYY-MM-DD)"
  echo "  JOB_NAME    (선택) 실행할 Spring Batch Job 이름. 미입력 시 기본값 사용."
  echo -e "\n허용된 JOB_NAME 목록:"
  for job in "${ALLOWED_JOBS[@]}"; do
    if [ "$job" == "$DEFAULT_JOB" ]; then
      echo "  - $job (기본값)"
    else
      echo "  - $job"
    fi
  done
  echo -e "\n실행 예시:"
  echo "  $0 2026-05-01 2026-05-05"
  echo "  $0 2026-05-01 2026-05-05 dailyStatisticsJob"
  echo ""
  exit 1
}

# ----------------------------------------------------------------------
# 3. 파라미터 파싱 및 검증
# ----------------------------------------------------------------------
# 3-1. 필수 파라미터 개수 확인
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ 오류: 필수 파라미터(FROM_DATE, TO_DATE)가 누락되었습니다."
  print_usage
fi

FROM_DATE=$1
TO_DATE=$2
# $3이 비어있으면 DEFAULT_JOB 사용
JOB_NAME=${3:-$DEFAULT_JOB}

# 3-2. 날짜 형식 검증 (정규식: YYYY-MM-DD)
if ! [[ $FROM_DATE =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || ! [[ $TO_DATE =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "❌ 오류: 날짜 형식이 올바르지 않습니다. (YYYY-MM-DD 형식으로 입력해주세요)"
  print_usage
fi

# 3-3. 시작일이 종료일보다 늦은지 검증
if [[ "$FROM_DATE" > "$TO_DATE" ]]; then
  echo "❌ 오류: FROM_DATE($FROM_DATE)가 TO_DATE($TO_DATE)보다 늦을 수 없습니다."
  print_usage
fi

# 3-4. 허용된 Job 이름인지 검증
VALID_JOB=false
for job in "${ALLOWED_JOBS[@]}"; do
  if [ "$job" == "$JOB_NAME" ]; then
    VALID_JOB=true
    break
  fi
done

if [ "$VALID_JOB" = false ]; then
  echo "❌ 오류: 허용되지 않은 JOB_NAME 입니다 ('$JOB_NAME')."
  print_usage
fi

# ----------------------------------------------------------------------
# 4. K8s Job 배포 로직 (루프)
# ----------------------------------------------------------------------
echo "==== 🚀 백필 작업을 시작합니다 ===="
echo "Job Name   : $JOB_NAME"
echo "Period     : $FROM_DATE ~ $TO_DATE"
echo "==================================="

CURRENT_DATE="$FROM_DATE"

while [[ "$CURRENT_DATE" < "$TO_DATE" ]] || [[ "$CURRENT_DATE" == "$TO_DATE" ]]; do

  # K8s 리소스 이름은 소문자와 '-'만 허용되므로 소문자로 변환 (예: bf-dailystatisticsjob-2026-05-01)
  LOWER_JOB_NAME=$(echo "$JOB_NAME" | tr '[:upper:]' '[:lower:]')
  K8S_JOB_NAME="bf-${LOWER_JOB_NAME}-${CURRENT_DATE}"

  echo "⏳ Job 배포 중: $K8S_JOB_NAME (targetDate=$CURRENT_DATE)"

  cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: $K8S_JOB_NAME
  namespace: default
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: blog-batch
          image: contentria/blog-batch:1.1
          args:
            - "--spring.batch.job.enabled=true"
            - "--spring.batch.job.name=$JOB_NAME"
            - "targetDate=$CURRENT_DATE"
          envFrom:
            - configMapRef:
                name: blog-batch-config
            - secretRef:
                name: blog-batch-secret
EOF

  sleep 1

  # OS 호환 날짜 계산 (Linux의 date 명령어와 Mac OS의 date 명령어 모두 지원)
  # Linux(CI/CD)에서는 -d 옵션, Mac에서는 -v 옵션이 작동합니다.
  CURRENT_DATE=$(date -d "$CURRENT_DATE + 1 day" +%Y-%m-%d 2>/dev/null || date -v+1d -j -f "%Y-%m-%d" "$CURRENT_DATE" "+%Y-%m-%d")

done

echo "==== 🎉 백필 K8s Job 배포가 완료되었습니다. K9s에서 상태를 확인하세요! ===="