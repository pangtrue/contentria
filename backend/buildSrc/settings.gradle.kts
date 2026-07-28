// buildSrc is a fully separate Gradle build (its own Settings instance), built before the
// root build's settings/build scripts are evaluated. It does not inherit the root build's
// version catalog. The root build gets `libs` for free via Gradle's auto-detection of
// gradle/libs.versions.toml; buildSrc has no such file under its own gradle/, so it must
// point at the root build's file explicitly to reuse the same versions.
dependencyResolutionManagement {
    versionCatalogs {
        create("libs") {
            from(files("../gradle/libs.versions.toml"))
        }
    }
}