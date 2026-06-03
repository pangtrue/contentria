package com.contentria.api.video.infrastructure

import com.contentria.api.video.domain.Video
import com.contentria.api.video.domain.VideoRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class VideoRepositoryImpl(
    private val videoJpaRepository: VideoJpaRepository
) : VideoRepository {

    override fun findById(id: UUID): Video? {
        return videoJpaRepository.findByIdOrNull(id)
    }

    override fun findByPostId(postId: UUID): Video? {
        return videoJpaRepository.findByPostId(postId)
    }

    override fun findByRawKey(rawKey: String): Video? {
        return videoJpaRepository.findByRawKey(rawKey)
    }

    override fun save(video: Video): Video {
        return videoJpaRepository.save(video)
    }

    override fun delete(video: Video) {
        videoJpaRepository.delete(video)
    }
}
