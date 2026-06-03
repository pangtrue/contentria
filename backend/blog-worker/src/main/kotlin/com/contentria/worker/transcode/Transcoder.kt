package com.contentria.worker.transcode

import java.util.UUID

/**
 * Port for turning a raw uploaded video into HLS outputs. The pull skeleton (#73) wires
 * everything around this interface; the real FFmpeg implementation arrives in #74.
 */
interface Transcoder {
    fun transcode(job: TranscodeJob): TranscodeResult
}

data class TranscodeJob(
    val videoId: UUID,
    val rawKey: String,
)

data class TranscodeResult(
    val hlsPrefix: String,
    val masterKey: String,
    val posterKey: String,
    val durationMs: Long?,
    val width: Int?,
    val height: Int?,
)
