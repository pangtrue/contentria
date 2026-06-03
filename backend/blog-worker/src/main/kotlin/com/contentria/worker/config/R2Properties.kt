package com.contentria.worker.config

import org.springframework.boot.context.properties.ConfigurationProperties

/** Cloudflare R2 (S3-compatible) access for the worker. Credentials come from env / K8s Secret. */
@ConfigurationProperties(prefix = "r2")
data class R2Properties(
    val accessKeyId: String,
    val secretAccessKey: String,
    val endpoint: String,
    val bucketName: String,
)
