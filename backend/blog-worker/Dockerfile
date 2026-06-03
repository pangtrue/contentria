# =============================================================================
# blog-worker image — long-running video transcoder.
#
# Mirrors the multi-stage / layered-JAR pattern of blog-api & blog-batch, with one
# addition: the runtime stage installs the native ffmpeg/ffprobe binaries, which the
# worker invokes as subprocesses (see FfmpegTranscoder).
#
# Build context is `backend/` (same as the other modules):
#   docker build -f blog-worker/Dockerfile -t blog-worker .
# =============================================================================

# =============================================================================
# 1. BUILD STAGE
# =============================================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app
COPY gradlew settings.gradle.kts /app/
COPY gradle /app/gradle/

# All module build scripts are required so Gradle can configure the multi-module build.
COPY buildSrc /app/buildSrc/
COPY blog-common/build.gradle.kts blog-common/
COPY blog-api/build.gradle.kts blog-api/
COPY blog-batch/build.gradle.kts blog-batch/
COPY blog-worker/build.gradle.kts blog-worker/

RUN chmod +x ./gradlew \
    && ./gradlew --no-daemon --stacktrace :blog-worker:dependencies

# Source for blog-worker and its dependency blog-common.
COPY blog-common/src blog-common/src
COPY blog-worker/src blog-worker/src

RUN ./gradlew --no-daemon -x test :blog-worker:bootJar

ARG JAR_FILE=/app/blog-worker/build/libs/blog-worker-*.jar
RUN java -Djarmode=layertools -jar ${JAR_FILE} extract --destination blog-worker/build/extracted

# =============================================================================
# 2. RUN STAGE
# =============================================================================
FROM eclipse-temurin:21-jre-alpine AS runner

# Native transcoding tools (provides both ffmpeg and ffprobe).
RUN apk add --no-cache ffmpeg

WORKDIR /app
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Scratch space for downloads + HLS output (mount an emptyDir here in K8s).
RUN mkdir -p /tmp/transcode && chown spring:spring /tmp/transcode

COPY --from=builder /app/blog-worker/build/extracted/dependencies/ ./
COPY --from=builder /app/blog-worker/build/extracted/spring-boot-loader/ ./
COPY --from=builder /app/blog-worker/build/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/blog-worker/build/extracted/application/ ./

USER spring

ENTRYPOINT ["java", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+ExitOnOutOfMemoryError", \
    "org.springframework.boot.loader.launch.JarLauncher"]
CMD []
