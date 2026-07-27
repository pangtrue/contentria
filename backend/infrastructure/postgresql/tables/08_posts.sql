CREATE TABLE posts (
    id UUID PRIMARY KEY,
    slug VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_markdown TEXT,
    summary VARCHAR(500),
    meta_title VARCHAR(255), -- SEO(검색 엔진), 소셜 미디어 공유를 위한 컬럼
    meta_description VARCHAR(500), -- SEO(검색 엔진), 소셜 미디어 공유를 위한 컬럼
    featured_image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PUBLISHED', 'ARCHIVED', 'PUBLISHED'
    like_count INT NOT NULL DEFAULT 0,
    view_count INT NOT NULL DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    author_id UUID,
    blog_id UUID NOT NULL,
    category_id UUID,

    CONSTRAINT uq_posts_blog_slug UNIQUE (blog_id, slug),
    -- 블로그 삭제 시 글도 삭제된다. (CASCADE)
    CONSTRAINT fk_posts_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    -- 카테고리 삭제 시 해당 카테고리에 속한 글이 있으면 삭제 방지 (RESTRICT)
    CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    -- 유저 탈퇴 시 작성자 정보를 NULL로 변경 (글은 보존)
    CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_posts_blog_id_status_published_at ON posts(blog_id, status, published_at DESC);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author_id ON posts(author_id);