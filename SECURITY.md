# Security Policy

This document outlines the security model of `.skilltree`, how custom skill prompts are audited, and how to report security vulnerabilities.

---

## 🛡️ Security Model

Because `.skilltree` compiles prompt instructions directly into files loaded by AI agents in your IDE and terminal, security is a core priority. AI agents possess execution capabilities; therefore, injected prompts or unauthorized workspace configurations pose a security risk.

### 1. Safe Rule Compilation
The compiler script (`.bin/skill-add.cjs`) operates strictly locally.
* **No Network Calls:** It does not send code or metadata to external servers. All workspace scanning and rule compilation happen entirely on your machine.
* **Non-destructive Merging:** The compiler uses safety markers (`### 🌲 --- SKILLTREE SECTION START ---`) to ensure it only overwrites its own generated rules, preserving any custom user rules.

### 2. Prompt Injection Mitigation
If you write or load custom skill nodes, ensure they do not contain adversarial instructions (prompt injections) designed to:
* Bypass safety boundaries of underlying LLMs.
* Force the agent to execute unauthorized terminal commands.
* Exfiltrate local workspace data or environment variables.

---

## 🤝 Reporting a Vulnerability

If you discover a security vulnerability within the CLI compiler or any of the official skill nodes:

1. **Do NOT open a public issue.**
2. Send an email to the maintainers at **security@skilltree.dev** (or submit a private vulnerability report via GitHub Security Advisories at `https://github.com/Leosdc/skilltree/security/advisories`).
3. Provide a detailed description of the vulnerability, steps to reproduce, and any proof of concept.

We will acknowledge your report within 48 hours and work on a patch as quickly as possible.
