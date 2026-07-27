CREATE TABLE visit_logs (
    id UUID PRIMARY KEY,
    blog_id UUID NOT NULL,
    post_id UUID, -- NULL이면 블로그 홈 방문, 값이 있으면 특정 게시글 방문
    visitor_ip VARCHAR(45), -- IP 주소 (방문자 중복 제거용, 개인정보 보호를 위해 해싱 필요)
    user_agent TEXT, -- 기기 정보 (예: 모바일/PC 구분 등)
    referer_url TEXT, -- 유입 경로 (예: 검색 엔진, 소셜 미디어 등)
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_logs_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
);

CREATE INDEX idx_visit_logs_date ON visit_logs (blog_id, visited_at);
CREATE INDEX idx_visit_logs_dedup ON visit_logs (blog_id, post_id, visitor_ip, visited_at);