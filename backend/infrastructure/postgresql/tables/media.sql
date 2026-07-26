CREATE TABLE media (
    id UUID PRIMARY KEY,
    post_id UUID,
    uploader_id UUID NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_key VARCHAR(500) NOT NULL,
    public_url TEXT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_media_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
    CONSTRAINT fk_media_uploader FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_media_post_id ON media(post_id);
CREATE INDEX idx_media_uploader_id ON media(uploader_id);