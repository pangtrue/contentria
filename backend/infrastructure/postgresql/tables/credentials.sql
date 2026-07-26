CREATE TABLE credentials (
     id UUID PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     password VARCHAR(255),
     provider VARCHAR(50) NOT NULL, -- 'EMAIL', 'GOOGLE'
     provider_id TEXT, -- 해당 Provider(구글 로그인)에서의 사용자 ID
     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

     user_id UUID NOT NULL,

     CONSTRAINT uq_credentials_email UNIQUE (email),
     CONSTRAINT uq_credentials_provider_id UNIQUE (provider, provider_id),
     CONSTRAINT fk_credentials_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_credentials_user_id ON credentials(user_id);