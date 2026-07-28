-- pg_stat_statements requires shared_preload_libraries = 'pg_stat_statements' in
-- postgresql.conf first — that GUC is postmaster-context (server restart required),
-- so it cannot be set from SQL. CREATE EXTENSION will error until that's done.
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
