# =============================================================================
# [ DOCKERFILE ARCHITECTURE & INTENT ]
#
# This Dockerfile utilizes a "Multi-Stage Build" pattern and Spring Boot's
# "Layered JAR" feature to create a highly optimized, secure, and production-
# ready Docker image.
#
# Why is it designed this way?
# 1. Image Size (Multi-Stage): We use a heavy JDK image for building the app
#    (Stage 1), but discard it. The final image (Stage 2) uses a lightweight
#    JRE image, significantly reducing the final image size and attack surface.
# 2. Build Speed (Caching): By carefully copying build files (gradlew, etc.)
#    before the source code, we leverage Docker's layer caching. If source code
#    changes, dependencies are NOT re-downloaded.
# 3. Layered JARs: Spring Boot 2.3+ allows splitting the JAR into layers
#    (dependencies, spring-boot-loader, application logic). This means pushing
#    updates to your registry is blazingly fast because only the 'application'
#    layer changes.
# 4. Security: The application runs as a non-root user ('spring') following
#    the principle of least privilege.
# =============================================================================

# =============================================================================
# 1. BUILD STAGE: Application Compilation and Layered JAR Extraction
# =============================================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

# =============================================================================
# 1.1. Setup Working Directory and Copy Gradle Wrapper/Configuration Files
# =============================================================================
WORKDIR /app
COPY gradlew settings.gradle.kts /app/
COPY gradle /app/gradle/

# =============================================================================
# 1.2. Copy Module Build Scripts
#      Required for Gradle to resolve inter-module dependencies accurately.
# =============================================================================
COPY buildSrc /app/buildSrc/
COPY blog-common/build.gradle.kts blog-common/
COPY blog-api/build.gradle.kts blog-api/
COPY blog-batch/build.gradle.kts blog-batch/
COPY blog-worker/build.gradle.kts blog-worker/

# =============================================================================
# 1.3. Download Gradle Dependencies
#      Specifically downloads dependencies for the `blog-worker` module.
# =============================================================================
RUN chmod +x ./gradlew \
    && ./gradlew --no-daemon --stacktrace :blog-worker:dependencies

# =============================================================================
# 1.4. Copy Source Code for Relevant Modules
#      Copies source code for `blog-worker` and its dependency `blog-common`.
# =============================================================================
COPY blog-common/src blog-common/src
COPY blog-worker/src blog-worker/src

# =============================================================================
# 1.5. Build Spring Boot JAR for blog-worker Module
#      Executes the `bootJar` task specifically for the worker module.
# =============================================================================
RUN ./gradlew --no-daemon -x test :blog-worker:bootJar

# =============================================================================
# 1.6. Extract Spring Boot Layered JAR
#      Separates the built JAR into cacheable layers.
# =============================================================================
ARG JAR_FILE=/app/blog-worker/build/libs/blog-worker-*.jar
RUN java -Djarmode=layertools -jar ${JAR_FILE} extract --destination blog-worker/build/extracted

# =============================================================================
# 2. RUN STAGE: Production-Ready Worker Execution Environment
# =============================================================================
FROM eclipse-temurin:21-jre-alpine AS runner

# =============================================================================
# 2.1. Install Native Transcoding Tools
#      The worker invokes ffmpeg/ffprobe as subprocesses (see FfmpegTranscoder).
#      The apk package provides both binaries.
# =============================================================================
RUN apk add --no-cache ffmpeg

# =============================================================================
# 2.2. Setup Working Directory and Create Non-Root User
# =============================================================================
WORKDIR /app
RUN addgroup --system spring && adduser --system --ingroup spring spring

# =============================================================================
# 2.3. Create Transcoding Scratch Directory
#      Holds the downloaded source + HLS output during a job. Mount an emptyDir
#      here in K8s; sized for one job (raw <= 500 MB + outputs).
# =============================================================================
RUN mkdir -p /tmp/transcode && chown spring:spring /tmp/transcode

# =============================================================================
# 2.4. COPY Layered JAR Contents from Build Stage
#      Order matters: Least frequently changed layers first.
# =============================================================================
COPY --from=builder /app/blog-worker/build/extracted/dependencies/ ./
COPY --from=builder /app/blog-worker/build/extracted/spring-boot-loader/ ./
COPY --from=builder /app/blog-worker/build/extracted/snapshot-dependencies/ ./
COPY --from=builder /app/blog-worker/build/extracted/application/ ./

# =============================================================================
# 2.5. Configure Runtime Environment
#      Switch to non-root user.
#      Note: EXPOSE is omitted because the worker pulls from Cloudflare Queue and
#      does not serve HTTP traffic.
# =============================================================================
USER spring

# =============================================================================
# 2.6. Define Application Entrypoint and Default Command
#      Specifies how the worker starts. It runs continuously, polling the queue.
# =============================================================================
ENTRYPOINT ["java", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+ExitOnOutOfMemoryError", \
    "org.springframework.boot.loader.launch.JarLauncher"]
CMD []
