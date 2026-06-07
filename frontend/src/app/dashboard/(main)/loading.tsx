import { Skeleton } from '@/components/ui/skeleton';

/**
 * (main) 대시보드 공통 로딩 스켈레톤.
 * 메뉴 전환 시 서버 컴포넌트가 데이터를 가져오는 동안 헤더/사이드바(레이아웃)는
 * 그대로 두고 콘텐츠 영역에만 즉시 표시되어 "처리 중" 피드백을 준다.
 */
export default function DashboardMainLoading() {
  return (
    <div className="space-y-6">
      {/* 페이지 제목 + 설명 */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* 콘텐츠 카드: 목록형 화면(글/카테고리)과 카드형 화면(대시보드/설정)을
          모두 어색하지 않게 덮는 중립적인 행 스켈레톤 */}
      <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-5/6" />
        </div>
      </div>
    </div>
  );
}
