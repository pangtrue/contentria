plugins {
    id("contentria-spring-library-conventions")
    id("contentria-jpa-conventions")
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    implementation("org.jetbrains.kotlin:kotlin-reflect")

    // UUIDv7. Identifiers are generated in the application, not by the database,
    // so an aggregate always has an identity from the moment it is constructed.
    implementation(libs.uuid.creator)

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}