package com.contentria.api.post.controller.dto

import com.contentria.api.post.application.dto.RecentPostInfo
import java.time.ZonedDateTime

data class RecentPostResponse(
    val title: String,
    val summary: String,
    val postSlug: String,
    val blogSlug: String,
    val blogTitle: String,
    val publishedAt: ZonedDateTime?
) {
    companion object {
        fun from(info: RecentPostInfo): RecentPostResponse {
            return RecentPostResponse(
                title = info.title,
                summary = info.summary,
                postSlug = info.postSlug,
                blogSlug = info.blogSlug,
                blogTitle = info.blogTitle,
                publishedAt = info.publishedAt
            )
        }
    }
}
