package com.contentria.worker.transcode

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component

private val log = KotlinLogging.logger {}

/**
 * Placeholder transcoder for the pull skeleton (#73). It does NOT run FFmpeg — it only
 * returns the output keys the real implementation (#74) will produce, so the full queue
 * → DB lifecycle can be exercised end to end. Replace with `FfmpegTranscoder` in #74.
 */
@Component
class StubTranscoder : Transcoder {

    override fun transcode(job: TranscodeJob): TranscodeResult {
        log.warn {
            "StubTranscoder: skipping real transcode for videoId=${job.videoId}, " +
                "rawKey=${job.rawKey} (FFmpeg implementation: #74)"
        }
        val hlsPrefix = "hls/${job.videoId}/"
        return TranscodeResult(
            hlsPrefix = hlsPrefix,
            masterKey = "${hlsPrefix}master.m3u8",
            posterKey = "${hlsPrefix}poster.jpg",
            durationMs = null,
            width = null,
            height = null,
        )
    }
}
