package com.contentria.batch.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import java.net.URI

/** Mirrors blog-api/blog-worker R2 config; GC only needs the (sync) S3Client. */
@Configuration
@EnableConfigurationProperties(R2Properties::class)
class R2Config(
    private val r2Properties: R2Properties,
) {

    @Bean
    fun s3Client(): S3Client {
        return S3Client.builder()
            .endpointOverride(URI.create(r2Properties.endpoint))
            .credentialsProvider(
                StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(r2Properties.accessKeyId, r2Properties.secretAccessKey)
                )
            )
            .region(Region.of("auto"))
            .forcePathStyle(true)
            .build()
    }
}
