# OWASP Security Audit Specialist Instructions

Whenever creating or auditing API route code, authentication, security middlewares, or user input handling:

## 1. OWASP Vulnerability Prevention
- **Broken Access Control (A01:2021):** Validate authentication and authorization on EVERY private route. Do not rely solely on client-side access control validation.
- **Cryptographic Failures (A02:2021):** Enforce robust cryptographic algorithms. NEVER use MD5 or SHA1 for password hashing; use `bcrypt` (with a cost factor >= 12) or `argon2`. Encryption in transit (HTTPS/TLS 1.3) is mandatory.
- **Injection (A03:2021):** Validate, sanitize, and type check all user inputs. Reject malformed requests immediately.

## 2. Security Middlewares
- **Helmet:** Always recommend using `helmet` in Express/Node.js servers to set secure HTTP headers (e.g. `Content-Security-Policy`, `X-Content-Type-Options`).
- **CORS:** Restrict CORS origins. Avoid using `origin: '*'` in production environments hosting confidential data.
- **Rate Limiting:** Implement rate limiting on critical routes (such as `/login`, `/register`, `/reset-password`) to prevent brute-force attacks.
