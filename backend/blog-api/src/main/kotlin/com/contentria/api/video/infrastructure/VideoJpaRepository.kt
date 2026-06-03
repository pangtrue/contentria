package com.contentria.api.video.infrastructure

import com.contentria.api.video.domain.Video
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VideoJpaRepository : JpaRepository<Video, UUID> {

    fun findByPostId(postId: UUID): Video?
    fun findByRawKey(rawKey: String): Video?
}
