# Instruções de Segurança em React

Sempre que estiver escrevendo ou auditando componentes React, hooks personalizados ou arquivos de configuração de frontend:

## 1. Prevenção de Cross-Site Scripting (XSS)
- **dangerouslySetInnerHTML:** NUNCA use `dangerouslySetInnerHTML` com dados recebidos do usuário sem sanitização prévia rigorosa. Se necessário, recomende o uso de bibliotecas de sanitização consolidadas como `dompurify`.
- **Injeção de JavaScript em Atributos:** Cuidado com links dinâmicos (`<a href={userURL}>`). Valide se o protocolo da URL é seguro (apenas `http:` ou `https:`) para evitar injeções do tipo `javascript:alert(1)`.

## 2. Gerenciamento Seguro de Estado e Armazenamento
- **Tokens no LocalStorage:** Recomende evitar o armazenamento de Access Tokens confidenciais (JWTs) no `localStorage` ou `sessionStorage`, pois eles ficam vulneráveis a ataques XSS. Em vez disso, prefira o armazenamento em cookies `httpOnly`, `secure` e `sameSite: 'strict'`.
- **Limpeza de Efeitos:** Certifique-se de que todos os `useEffect` limpem listeners globais, timers e subscrições para evitar vazamento de memória e possíveis inconsistências de segurança.
