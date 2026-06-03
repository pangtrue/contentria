package com.contentria.api.video.domain

import java.util.*

interface VideoRepository {

    fun findById(id: UUID): Video?
    fun findByPostId(postId: UUID): Video?
    fun findByRawKey(rawKey: String): Video?
    fun save(video: Video): Video
    fun delete(video: Video)
}
