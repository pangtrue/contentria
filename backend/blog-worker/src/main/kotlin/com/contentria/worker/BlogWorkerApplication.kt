package com.contentria.worker

import com.contentria.worker.config.CloudflareProperties
import org.springframework.boot.WebApplicationType
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

/**
 * Long-running worker that transcodes uploaded videos. The work queue is Cloudflare
 * Queue, which this app pulls directly via an `http_pull` consumer (see
 * `backend/docs/cloudflare/video-pipeline.md`). It accesses the `videos` table with
 * JdbcTemplate (no dependency on blog-api's JPA entity), mirroring `blog-batch`.
 *
 * Component scan is scoped to this module so blog-common's web/JPA beans are not pulled in.
 */
@SpringBootApplication(scanBasePackages = ["com.contentria.worker"])
@EnableConfigurationProperties(CloudflareProperties::class)
@EnableScheduling
class BlogWorkerApplication

fun main(args: Array<String>) {
    runApplication<BlogWorkerApplication>(*args) {
        setWebApplicationType(WebApplicationType.NONE)
    }
}
