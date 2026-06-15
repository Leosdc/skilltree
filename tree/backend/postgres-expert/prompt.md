# Postgres Optimization Expert Instructions

When working with SQL queries, table schemas, or migrations in PostgreSQL:

## 1. Query Optimization & Indexing
- **EXPLAIN ANALYZE:** Always recommend using `EXPLAIN (ANALYZE, BUFFERS)` to analyze the physical execution plan of slow queries.
- **Partial Indexes:** If a column is heavily filtered on specific values (e.g., `status = 'active'`), use partial indexes to reduce disk footprint.
- **Covering Indexes:** Utilize the `INCLUDE` clause to add extra columns to the index, allowing Index-Only Scans.
- **Avoid N+1 Queries:** Recommend explicit joins or batch loading instead of running repetitive queries inside loops in the application.

## 2. Modeling & Database Integrity
- **Data Types:** Prefer native `uuid` over sequential integers for publicly exposed primary keys. Use `jsonb` instead of `json` for dynamic documents.
- **Constraints:** Always enforce integrity constraints in the database (e.g., `FOREIGN KEY`, `NOT NULL`, `CHECK`), reducing reliance on application-level validation.

## 3. SQL Injection Prevention
- **Prepared Statements / Parameterized Queries:** NEVER concatenate user values directly into query strings. Use placeholders (`$1`, `$2`) provided by the driver.
- **Principle of Least Privilege:** Limit database connection account permissions to only the strictly necessary tables and actions.
