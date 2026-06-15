# Política de Segurança

Este documento descreve o modelo de segurança do `.skilltree`, como os prompts de habilidades personalizadas são auditados e como reportar vulnerabilidades.

---

## 🛡️ Modelo de Segurança

Como o `.skilltree` compila diretrizes de prompt diretamente em arquivos consumidos por agentes de IA na sua IDE e terminal, a segurança é nossa prioridade máxima. Agentes de IA possuem capacidades de execução; logo, prompts injetados ou configurações não autorizadas no workspace podem representar riscos de segurança.

### 1. Compilação de Regras Segura
O script do compilador (`bin/skill-add.cjs`) opera de forma estritamente local:
* **Sem Chamadas de Rede:** Não envia código ou metadados para servidores externos. Todo o escaneamento do workspace e a compilação das regras ocorrem inteiramente na sua máquina local.
* **Mesclagem Não Destrutiva:** O compilador utiliza marcadores de segurança (`### 🌲 --- SKILLTREE SECTION START ---`) para garantir que apenas sua própria seção gerada seja alterada, preservando todas as demais regras customizadas do usuário.

### 2. Mitigação de Injeção de Prompt (Prompt Injection)
Ao escrever ou carregar nós de habilidades customizados, certifique-se de que eles não contenham instruções adversárias projetadas para:
* Burlar barreiras de segurança do modelo de linguagem (LLM) subjacente.
* Forçar o agente a executar comandos de terminal não autorizados.
* Exfiltrar dados locais do workspace ou variáveis de ambiente.

---

## 🤝 Reportando uma Vulnerabilidade

Caso você encontre uma vulnerabilidade de segurança no compilador CLI ou em qualquer um dos nós oficiais de habilidades do catálogo:

1. **NÃO abra uma issue pública.**
2. Envie um e-mail para os mantenedores em **security@skilltree.dev** (ou envie um relatório privado via GitHub Security Advisories em `https://github.com/Leosdc/skilltree/security/advisories`).
3. Forneça uma descrição detalhada da vulnerabilidade, passos para reprodução e uma prova de conceito (PoC).

Responderemos ao seu relatório em até 48 horas e trabalharemos em uma correção o mais rápido possível.
