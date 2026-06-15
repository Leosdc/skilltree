# Guia de Contribuição 🌲

Obrigado por querer contribuir para o **.skilltree**! Este projeto é construído sobre o conceito de **orquestração comunitária**, e a sua ajuda é fundamental para criarmos o maior catálogo de habilidades de IA do mercado.

Para manter a consistência de código, segurança e governança, siga este guia detalhado ao criar novas habilidades ou fazer melhorias no core.

---

## 🛠️ Processo de Desenvolvimento

### 1. Preparando o Ambiente
1. Faça um **Fork** do repositório do projeto.
2. Clone o seu fork localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/skilltree.git
   ```
3. Navegue até a pasta do projeto:
   ```bash
   cd skilltree
   ```

### 2. Fluxo de Trabalho Git (Git Flow & Branches)
Sempre crie uma nova branch para as suas alterações a partir da branch `main`. Utilize a convenção de nomenclatura baseada no tipo de alteração:

*   **Novas Habilidades (Skills):** `feature/skill-[nome-da-habilidade]` (ex: `feature/skill-redis-caching`)
*   **Correções de Bugs:** `bugfix/[nome-do-bug]` (ex: `bugfix/cli-parser-error`)
*   **Melhorias de Core ou Infraestrutura:** `refactor/[nome-da-melhoria]` (ex: `refactor/multi-ide-settings`)
*   **Documentação:** `docs/[nome-da-pagina]` (ex: `docs/contributing-guide`)

Para criar e acessar a nova branch:
```bash
git checkout -b feature/skill-minha-nova-habilidade
```

### 3. Padrão de Commits Semânticos (Conventional Commits)
Nossos commits seguem a especificação de **Conventional Commits** para garantir a geração automática de CHANGELOGs e rastreabilidade de governança:

*   `feat`: Adiciona uma nova funcionalidade ou habilidade (ex: `feat(skill): adicionado postgres-expert`)
*   `fix`: Corrige um bug (ex: `fix(cli): resolvido quebra de settings.json no windows`)
*   `docs`: Alteração apenas em arquivos de documentação (ex: `docs: adicionado guia de contribuicao`)
*   `refactor`: Alteração de código que não adiciona recurso nem corrige bug (ex: `refactor(core): otimizado loop de varredura`)
*   `chore`: Atualizações de tarefas de build, pacotes npm ou configurações de tooling (ex: `chore: atualizado manifest.json`)

**Exemplo de Commit:**
```bash
git commit -m "feat(skill): adicionada habilidade docker-hardening para DevOps"
```

---

## 🧬 Criando uma Nova Habilidade (Passo a Passo)

A melhor forma de criar um novo nó de habilidade é usando a própria CLI do framework, garantindo que os manifestos venham com a estrutura limpa e correta.

1.  **Execute o criador de habilidades** na raiz da sua pasta `skilltree`:
    ```bash
    node bin/skill-add.cjs create
    ```
2.  **Informe os dados solicitados**:
    *   **Nome da Habilidade**: O nome descritivo (ex: `Docker Hardening Specialist`).
    *   **Categoria**: Deve ser uma das pastas válidas de stack: `backend`, `frontend`, `DevOps` ou `security`.
3.  **Edite os arquivos gerados**:
    O CLI gerará uma pasta sob `tree/<categoria>/<id-da-habilidade>/` contendo dois arquivos obrigatórios:

#### A. O Manifesto (`manifest.json`)
Contém os metadados do nó de habilidade e os triggers automáticos de detecção.
```json
{
  "id": "docker-hardening",
  "name": "Docker & K8s Hardening Specialist",
  "category": "DevOps",
  "description": "Práticas avançadas para containerização segura e redução da superfície de ataque em Dockerfiles.",
  "compatibility": {
    "cursor": true,
    "claude": true,
    "antigravity": true
  },
  "triggers": {
    "files": ["Dockerfile", "docker-compose.yml", "kubernetes.yaml"],
    "dependencies": []
  }
}
```
*   `triggers.files`: Coloque arquivos característicos desta stack (ex: `*.sql`, `vite.config.js`).
*   `triggers.dependencies`: Coloque dependências NPM características do package.json (ex: `prisma`, `pg`, `express`).

#### B. As Instruções (`prompt.md`)
Aqui reside a inteligência da habilidade. Os prompts devem seguir as **Diretrizes de Qualidade da Skill Tree**:
*   **Conciso e Direto**: Evite textos introdutórios ou floreados. Vá direto às regras técnicas.
*   **Regras Negativas Fortes**: Use termos como *"NUNCA"*, *"EVITE"*, *"OBRIGATÓRIO"* para travar o comportamento do LLM.
*   **Foco em Segurança e Governança**: Sempre priorize regras que impeçam falhas de segurança do OWASP, vazamento de memória e códigos não-produção.

#### C. Convenção de Idiomas e Localização (MANDATÓRIO)
Como o projeto suporta desenvolvedores do mundo inteiro, a Skill Tree utiliza uma arquitetura nativa multi-idioma por pasta de habilidade. Siga estritamente estas diretrizes ao criar ou traduzir nós:

1. **Arquivos Base (Em Inglês)**:
   * Por padrão, o prompt principal `prompt.md` e os campos `name` e `description` em `manifest.json` devem ser escritos em **Inglês** (o idioma padrão de tecnologia).
   * O ID deve ser simples e limpo, sem sufixos de idioma (ex: `docker-hardening`).

2. **Localização (Ex: Português, Espanhol, etc.)**:
   * **NÃO** crie uma pasta de habilidade separada ou IDs diferentes para versões traduzidas. Mantenha tudo na mesma pasta.
   * Adicione prompts localizados criando um novo arquivo com o sufixo correspondente do idioma (ex: `prompt.pt.md` para Português).
   * Adicione metadados traduzidos no manifesto `manifest.json` dentro do objeto `locales` usando o código de idioma correspondente.

**Exemplo de manifest.json com localização:**
```json
{
  "id": "docker-hardening",
  "name": "Docker & K8s Hardening Specialist",
  "category": "DevOps",
  "description": "Strict security guidelines for Dockerfiles, Docker Compose, and Kubernetes manifests.",
  "locales": {
    "pt": {
      "name": "Especialista em Endurecimento Docker & K8s",
      "description": "Boas práticas rígidas de segurança para arquivos Dockerfile, Docker Compose e manifestos Kubernetes."
    }
  },
  "compatibility": {
    "cursor": true,
    "claude": true,
    "antigravity": true
  },
  "triggers": {
    "files": ["Dockerfile"],
    "dependencies": []
  }
}
```

---

## 🚀 Enviando o Pull Request (PR)

1.  **Valide o seu código**: Rode a CLI e certifique-se de que a nova habilidade aparece no menu interativo sem quebrar a renderização do mascote Neon-Cat.
2.  Faça o push da sua branch para o seu fork:
    ```bash
    git push origin feature/skill-minha-nova-habilidade
    ```
3.  Vá até o repositório original no GitHub e clique em **New Pull Request**.
4.  **Título do PR**: Siga o padrão Conventional Commits (ex: `feat(skill): adicionada habilidade redis-expert`).
5.  **Descrição do PR**:
    *   Explique resumidamente qual habilidade ou funcionalidade está sendo adicionada.
    *   Mostre quais são os triggers configurados no manifesto.
    *   Confirme se testou executando localmente a CLI.

O time de governança do projeto revisará o PR em até 48 horas! Obrigado por contribuir para o ecossistema. 🌲
