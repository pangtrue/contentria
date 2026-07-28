plugins {
    `kotlin-dsl`
}

repositories {
    gradlePluginPortal()
}

// Precompiled script plugins (src/main/kotlin/*.gradle.kts) can't use `plugins { id(x) version v }` —
// no version is allowed there. The plugin impl must already be resolvable on buildSrc's own
// classpath, so each one is added here as a regular dependency via its plugin marker artifact
// (`<pluginId>:<pluginId>.gradle.plugin:<version>`).
dependencies {
    implementation("org.springframework.boot:spring-boot-gradle-plugin:${libs.versions.spring.boot.get()}")
    implementation("io.spring.gradle:dependency-management-plugin:${libs.versions.spring.dependency.management.get()}")
    implementation("org.jetbrains.kotlin.jvm:org.jetbrains.kotlin.jvm.gradle.plugin:${libs.versions.kotlin.asProvider().get()}")
    implementation("org.jetbrains.kotlin.plugin.spring:org.jetbrains.kotlin.plugin.spring.gradle.plugin:${libs.versions.kotlin.asProvider().get()}")
    implementation("org.jetbrains.kotlin.plugin.jpa:org.jetbrains.kotlin.plugin.jpa.gradle.plugin:${libs.versions.kotlin.asProvider().get()}")
}