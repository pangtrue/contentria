CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 부모 카테고리 ID (최상위 카테고리는 NULL)
    -- 카테고리 최대 2-depth 제한은 데이터베이스 레벨에서 강제하기 복잡하므로, 애플리케이션 레벨에서 제한한다.
    parent_id UUID,

    blog_id UUID NOT NULL,

    CONSTRAINT up_categories_blog_slug UNIQUE (blog_id, slug),
    -- 블로그 삭제 시 카테고리도 삭제된다. (CASCADE)
    CONSTRAINT fk_categories_blog FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    -- 부모 카테고리 삭제 시 자식 카테고리가 있으면 삭제 방지 (RESTRICT)
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 최상위 카테고리는 블로그 내에서 이름이 중복될 수 없다.
CREATE UNIQUE INDEX uq_categories_toplevel ON categories(blog_id, name) WHERE parent_id IS NULL;
-- 하위 카테고리는 같은 부모 카테고리 아래에서 이름이 중복될 수 없다.
CREATE UNIQUE INDEX uq_categories_nested ON categories (blog_id, parent_id, name) WHERE parent_id IS NOT NULL;

CREATE INDEX idx_categories_blog_id ON categories(blog_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
