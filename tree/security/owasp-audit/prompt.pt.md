# Instruções de Auditoria de Segurança OWASP

Sempre que estiver criando ou auditando código de rotas de API, autenticação, middlewares de segurança ou tratamento de entradas de usuário:

## 1. Prevenção a Vulnerabilidades OWASP
- **Broken Access Control (A01:2021):** Valide autenticação e autorização em TODA rota privada. Não confie apenas no lado do cliente para validação de nível de acesso.
- **Cryptographic Failures (A02:2021):** Exija o uso de algoritmos criptográficos robustos. NUNCA use MD5 ou SHA1 para hashing de senhas; utilize `bcrypt` (com fator de custo >= 12) ou `argon2`. Criptografia em trânsito (HTTPS/TLS 1.3) é obrigatória.
- **Injection (A03:2021):** Valide, sanitize e tipifique todas as entradas do usuário. Rejeite requisições malformadas imediatamente.

## 2. Middlewares de Segurança
- **Helmet:** Sempre recomende o uso de `helmet` em servidores Express/Node.js para configurar cabeçalhos HTTP seguros (ex: `Content-Security-Policy`, `X-Content-Type-Options`).
- **CORS:** Restrinja as origens no CORS. Evite usar `origin: '*'` em ambientes de produção com dados confidenciais.
- **Rate Limit:** Implemente limitação de taxa (Rate Limit) nas rotas críticas (como `/login`, `/register`, `/reset-password`) para evitar ataques de força bruta.
