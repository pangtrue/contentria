CREATE ROLE contentria
    WITH LOGIN
    PASSWORD 'your_secure_password_here'
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE;

CREATE SCHEMA contentria AUTHORIZATION contentria;

-- contentria 롤에 해당 스키마 사용 권한 부여
GRANT USAGE, CREATE ON SCHEMA contentria TO contentria;

-- postgres 데이터베이스에 접속 권한 부여
GRANT CONNECT ON DATABASE postgres TO contentria;

ALTER ROLE contentria SET search_path TO contentria, public;