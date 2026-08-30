-- Videos are kept separate from `media`: a video has multi-file HLS output, an async
-- transcoding lifecycle (status), and extra metadata. The transcoding work queue is
-- Cloudflare Queue (pulled by blog-worker), so this table only tracks the asset
-- lifecycle, not queue state.
CREATE TABLE videos (
    id UUID PRIMARY KEY,
    post_id UUID, -- nullable: pre-publish / orphan allowed
    uploader_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED, DELETED

    -- source (raw)
    original_name VARCHAR(255) NOT NULL,
    raw_key VARCHAR(500) NOT NULL, -- raw/{id}/original.<ext>
    file_size BIGINT,
    content_type VARCHAR(100),

    -- transcoded outputs (filled on COMPLETED)
    hls_prefix VARCHAR(500), -- hls/{id}/
    master_key VARCHAR(500), -- hls/{id}/master.m3u8
    poster_key VARCHAR(500),
    duration_ms BIGINT,
    width INT, -- source resolution (no-upscale check)
    height INT,

    error_message TEXT, -- failure reason for FAILED (reader display)

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Post deletion orphans the video (cleaned up by GC), mirroring media.
    CONSTRAINT fk_videos_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
    -- User deletion removes their videos.
    CONSTRAINT fk_videos_uploader FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
    -- raw_key is allocated per videoId (raw/{id}/...), so it is unique by construction.
    CONSTRAINT uq_videos_raw_key UNIQUE (raw_key)
);

CREATE INDEX idx_videos_post_id ON videos(post_id);
-- Enforce one active video per post (product rule), as defense-in-depth on top of the
-- application. Partial so it excludes unattached uploads (post_id NULL) and DELETED rows
-- that linger during re-upload (immutable replace + soft delete) until GC.
CREATE UNIQUE INDEX uq_videos_post_active ON videos(post_id) WHERE post_id IS NOT NULL AND status <> 'DELETED';