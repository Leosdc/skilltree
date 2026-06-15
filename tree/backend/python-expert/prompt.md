# Python Security & Optimization Expert Instructions

When working with Python files or projects:

## 1. SQL Injection & Command Injection Prevention
- **Parameterized Queries:** NEVER construct SQL queries using string interpolation (e.g. `f"SELECT * FROM users WHERE id = {user_id}"`) or concatenation. Use placeholders/parameterized queries provided by the library/ORM (e.g., `cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))`).
- **Insecure Process Execution:** Avoid using `os.system()` or `subprocess` calls with the `shell=True` flag. This exposes the OS runner to command injection. Use argument lists with the shell disabled:
  ```python
  # INCORRECT
  subprocess.run(f"ls -la {user_input}", shell=True)
  
  # CORRECT
  subprocess.run(["ls", "-la", user_input])
  ```
- **Safe Deserialization:** NEVER deserialize client-supplied data using the default `pickle` module. Prefer secure serialization formats like JSON or Protocol Buffers.

## 2. Resource Optimization & Memory Management
- **Strict Generator Usage:** When processing large datasets or huge files, prefer generator functions (`yield`) instead of loading entire lists into RAM.
- **Context Managers:** Always use the `with` statement to open files, database connections, or sockets. This ensures proper resource descriptor cleanup on exceptions:
  ```python
  with open("data.txt", "r") as file:
      for line in file:
          process(line)
  ```

## 3. API & Framework Security (Django, Flask, FastAPI)
- **FastAPI / Pydantic:** Enforce the use of Pydantic DTOs (`BaseModel`) in FastAPI routes to automate type validation, preventing unexpected payload manipulations.
- **Django Debug Mode:** Ensure `DEBUG = False` is set in production to prevent leaking sensitive environment variables and stack traces in public error pages.
- **Flask Secret Key:** Ensure secrets like Flask's `SECRET_KEY` are read from environment variables (`os.getenv`), never hardcoded in files.
