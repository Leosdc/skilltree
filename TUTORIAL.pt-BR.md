# Guia de Integração e Uso - Skill Tree

Este tutorial guia você no processo de instalação, configuração de atalhos e uso prático do `.skilltree` no seu ambiente de desenvolvimento.

---

## 📦 Como Integrar nos seus Projetos

O `.skilltree` foi projetado para ser clonado como uma pasta oculta chamada `.skilltree` dentro do repositório de qualquer projeto. Isso permite salvar e versionar as regras do time de desenvolvimento de forma isolada por projeto.

### Passo 1: Clonar no projeto
Abra seu terminal na raiz do projeto onde deseja habilitar a Skill Tree e execute:
```bash
git clone https://github.com/Leosdc/skilltree.git .skilltree
```

### Passo 2: Executar o compilador
Abra o painel interativo de gerenciamento de habilidades ou utilize a linha de comando para começar.
```bash
node .skilltree/.bin/skill-add.cjs
```
O utilitário detecta automaticamente que está sob a pasta `.skilltree` e passará a ler/escrever os arquivos de regras (como `.cursorrules` e `.clauderules`) **um nível acima, na raiz do seu projeto hospedeiro**.

---

## 🎮 Duas Formas de Interação (Menu vs. Linha de Comando)

O utilitário do Skill Tree oferece duas formas completas de gerenciamento:

### 1. Painel Interativo Visual (Recomendado)
Abre uma interface interativa diretamente no seu terminal com navegação dinâmica via teclado, exibindo o mascote original e a árvore de habilidades em colunas horizontais.
*   **Como abrir**:
    ```bash
    node .skilltree/.bin/skill-add.cjs
    # Ou se você configurou o alias:
    skill-add
    ```
*   **Controles**:
    *   **Setas (↑ / ↓ / ← / →)**: Navegar pela grade de habilidades e lista de ações inferiores.
    *   **Espaço / Enter (sobre uma habilidade)**: Alternar o status de ativação (marcar/desmarcar) da habilidade selecionada no workspace.
    *   **Enter (sobre uma ação)**: Executa ações imediatas (como executar a varredura automática, criar novas habilidades manuais, mudar idioma ou visualizar as regras em JSON).

### 2. Comandos CLI Diretos (Automação / Sem Interface)
Para quem prefere a agilidade da linha de comando tradicional ou deseja automatizar a ativação de regras em scripts do sistema e pipelines de CI/CD.
*   **Inicializar a estrutura do workspace**:
    ```bash
    node .skilltree/.bin/skill-add.cjs init
    ```
*   **Listar habilidades cadastradas e seus status**:
    ```bash
    node .skilltree/.bin/skill-add.cjs list
    ```
*   **Ativar uma habilidade específica**:
    ```bash
    node .skilltree/.bin/skill-add.cjs add <id-da-habilidade>
    # Exemplo: node .skilltree/.bin/skill-add.cjs add postgres-expert
    ```
*   **Desativar uma habilidade específica**:
    ```bash
    node .skilltree/.bin/skill-add.cjs remove <id-da-habilidade>
    # Exemplo: node .skilltree/.bin/skill-add.cjs remove postgres-expert
    ```
*   **Criar nova habilidade local (assistente de texto)**:
    ```bash
    node .skilltree/.bin/skill-add.cjs create
    ```
*   **Executar varredura automática do código**:
    ```bash
    node .skilltree/.bin/skill-add.cjs scan
    ```

---

## ⚡ Atalhos de Terminal Globais (Aliases)

Para facilitar o uso e evitar digitar o caminho completo do script toda vez, você pode mapear um alias no seu terminal.

### No Windows (PowerShell)
Adicione esta função ao seu perfil do PowerShell (descubra o caminho do perfil digitando `$PROFILE` no terminal):
```powershell
function skill-add {
    if (Test-Path ".skilltree\.bin\skill-add.cjs") {
        node .skilltree\.bin\skill-add.cjs $args
    } else {
        Write-Host "🌲 Subpasta .skilltree não encontrada." -ForegroundColor Yellow
    }
}
```

### No macOS / Linux (Bash ou Zsh)
Adicione esta linha no final do seu `~/.bashrc` ou `~/.zshrc`:
```bash
alias skill-add="node .skilltree/.bin/skill-add.cjs"
```
Com isso, em qualquer projeto que possua a pasta `.skilltree`, basta digitar:
```bash
skill-add
```

---

## 🤖 Como os Agentes de IA Leem as Regras

Ao ativar uma habilidade pelo painel ou por comando CLI, o compilador junta as instruções e as injeta nos locais específicos de forma **Local e Global**:

### 📍 Localmente (Workspace)
As regras consolidadas são escritas diretamente nos arquivos de configuração do projeto:
1. **Cursor IDE:** Compila arquivos inteligentes `.mdc` individuais dentro do diretório `.cursor/rules/` (usando frontmatter YAML com triggers globais e locais), além do arquivo tradicional `.cursorrules` na raiz do workspace.
2. **Claude Code CLI:** Lê o arquivo `.clauderules` na raiz da pasta.
3. **VS Code (GitHub Copilot):** Consome as diretrizes de `.github/copilot-instructions.md` ou `.copilot-instructions.md`.
4. **Windsurf IDE:** Lê as instruções de `.windsurfrules`.

### 🌐 Globalmente (Nível de Sistema / Usuário)
Para garantir que agentes autônomos (como o Antigravity IDE) ou instâncias globais de chat de IA (como o VS Code Chat ou Cursor Chat) leiam as habilidades do seu projeto imediatamente sem dependência de indexações locais, a CLI do Skill Tree realiza uma **sincronização global não-bloqueante**:
* **Antigravity IDE (Gemini):** Injeta uma diretriz de governança em `~/.gemini/antigravity-ide/user_rules.txt` forçando o carregamento dinâmico do Skill Tree local sempre que a pasta `.skilltree` for detectada no projeto ativo.
* **VS Code, Cursor e Windsurf:** Atualiza silenciosamente os arquivos de configuração globais de usuário (`settings.json`) adicionando ganchos de instruções customizados de IA (`github.copilot.chat.customInstructions`, `google.gemini.customInstructions`, etc.) para instruir a IA a inspecionar a árvore de habilidades ativas local.

---

## 🧬 Criando Habilidades Customizadas locais

Você pode adicionar suas próprias diretrizes de código à Skill Tree.

1. No terminal do projeto, execute o criador de nós:
   ```bash
   node .skilltree/.bin/skill-add.cjs create
   ```
2. Forneça o nome da habilidade (ex: `redis-caching`) e a categoria (ex: `backend`).
3. O CLI criará automaticamente:
   - A pasta `tree/backend/redis-caching/manifest.json` (com as chaves de trigger).
   - O arquivo `tree/backend/redis-caching/prompt.md` (onde você escreve as regras, no idioma ativo da sua CLI).
4. **Siga a Convenção de Estrutura Multi-idiomas (OBRIGATÓRIO para catálogo global):**
   Para tornar sua habilidade acessível a equipes globais, organize os arquivos da seguinte forma:
   *   **Prompt Base em Inglês:** Salve no arquivo padrão `prompt.md` (o idioma padrão de tecnologia).
   *   **Prompt Traduzido (ex: Português):** Salve em `prompt.pt.md`.
   *   **Metadados no Manifesto:** Forneça os valores padrão em inglês de `name` e `description` no nível raiz do `manifest.json`, e as traduções sob o objeto `locales`:
       ```json
       {
         "id": "redis-caching",
         "name": "Redis Caching Expert",
         "category": "backend",
         "description": "Rules for high-performance and secure caching using Redis.",
         "locales": {
           "pt": {
             "name": "Especialista em Cache Redis",
             "description": "Regras para cache de alta performance e segurança com Redis."
           }
         },
         "compatibility": {
           "cursor": true,
           "claude": true,
           "antigravity": true
         },
         "triggers": {
           "files": ["redis.config.js"],
           "dependencies": ["redis", "ioredis"]
         }
       }
       ```
5. Edite os arquivos para configurar o comportamento e as regras. O nó aparecerá instantaneamente no menu interativo do CLI, adaptando-se dinamicamente conforme o idioma selecionado pelo desenvolvedor!
