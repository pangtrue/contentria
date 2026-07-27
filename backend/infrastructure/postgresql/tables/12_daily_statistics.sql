CREATE TABLE daily_statistics (
    id UUID PRIMARY KEY,
    blog_id UUID NOT NULL,
    post_id UUID, -- 특정 게시글 통계라면 ID, 블로그 전체 통계라면 NULL
    stat_date DATE NOT NULL, -- 통계 날짜 (예: 2026-01-01)
    visit_count BIGINT DEFAULT 0, -- 방문자 수 (UV (Unique View): IP 기준 중복 제거)
    view_count BIGINT DEFAULT 0, -- 조회수 (PV (Page View): 단순 클릭 수)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- NULLS NOT DISTINCT lets the blog-wide aggregation row (post_id IS NULL)
    -- collide on re-run, which is required for idempotent upserts.
    CONSTRAINT uq_daily_stats_blog_post_date UNIQUE NULLS NOT DISTINCT (blog_id, post_id, stat_date),
    CONSTRAINT fk_stats_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);