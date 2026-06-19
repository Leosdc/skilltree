# Contributing Guide 🌲

Thank you for your interest in contributing to **.skilltree**! This project is built entirely on the philosophy of **crowdsourced orchestration**, and your help is crucial to building the largest catalog of specialized AI skills on the market.

To maintain code quality, security, and governance standards, please follow this detailed guide when proposing new skill nodes or core improvements.

---

## 🛠️ Development Workflow

### 1. Environment Setup
1. **Fork** this repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/skilltree.git
   ```
3. Navigate to the project root:
   ```bash
   cd skilltree
   ```

### 2. Git Workflow (Git Flow & Branches)
Always create a new branch from `main` for your modifications. Use the following naming convention based on the type of change:

*   **New Habilidades (Skills):** `feature/skill-[skill-name]` (e.g., `feature/skill-redis-caching`)
*   **Bug Fixes:** `bugfix/[bug-name]` (e.g., `bugfix/cli-parser-error`)
*   **Core / Infrastructure Improvements:** `refactor/[improvement-name]` (e.g., `refactor/multi-ide-settings`)
*   **Documentation:** `docs/[page-name]` (e.g., `docs/contributing-guide`)

To create and switch to your new branch:
```bash
git checkout -b feature/skill-my-new-skill
```

### 3. Semantic Commits (Conventional Commits)
Our commits follow the **Conventional Commits** specification to ensure automated CHANGELOG generation and traceability:

*   `feat`: Adds a new feature or skill node (e.g., `feat(skill): added postgres-expert`)
*   `fix`: Fixes a bug (e.g., `fix(cli): resolved settings.json crash on windows`)
*   `docs`: Documentation changes only (e.g., `docs: added contributing guide`)
*   `refactor`: Code changes that neither fix a bug nor add a feature (e.g., `refactor(core): optimized scan loop`)
*   `chore`: Tooling, npm dependency updates, or internal configuration changes (e.g., `chore: updated manifest.json`)

**Commit Example:**
```bash
git commit -m "feat(skill): added docker-hardening skill for DevOps category"
```

---

## 🧬 Creating a New Skill Node (Step-by-Step)

The best way to build a new skill node is using the framework's CLI to ensure the generated structure and manifests are clean and correct.

1.  **Run the node creator** at your `skilltree` repository root:
    ```bash
    node bin/skill-add.cjs create
    ```
2.  **Provide the requested metadata**:
    *   **Skill Name**: A descriptive name (e.g., `Docker Hardening Specialist`).
    *   **Category**: Must be one of the valid stack directories: `backend`, `frontend`, `DevOps`, or `security`.
3.  **Edit the generated files**:
    The CLI generates a folder under `tree/<category>/<skill-id>/` containing two mandatory files:

#### A. The Manifesto (`manifest.json`)
Contains node metadata and detection triggers.
```json
{
  "id": "docker-hardening",
  "name": "Docker & K8s Hardening Specialist",
  "category": "DevOps",
  "description": "Advanced guidelines for secure containerization and decreasing attack surfaces in Dockerfiles.",
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
*   `compatibility.claude`: When set to `true`, indicates compatibility with Claude Code (compiling rules into `CLAUDE.md` and `.clauderules`).
*   `triggers.files`: Add typical configuration files for the stack (e.g., `*.sql`, `vite.config.js`).
*   `triggers.dependencies`: Add NPM package names typical for this stack (e.g., `prisma`, `pg`, `express`).

#### B. The Guidelines (`prompt.md`)
This is where your skill's prompt guidelines reside. They must follow our **Skill Quality Guidelines**:
*   **Concise & Direct**: Avoid introductory text or chit-chat. Write clear, direct guidelines.
*   **Strong Negative Constraints**: Use bold terms like *"NEVER"*, *"AVOID"*, *"MANDATORY"* to enforce LLM behavior.
*   **Security & Governance Focus**: Always prioritize rules that prevent OWASP vulnerabilities, resource leaks, and non-production habits.

#### C. Language and Localization Convention (MANDATORY)
Since this project supports developers globally, the Skill Tree uses a native multi-language architecture per skill folder. Strictly follow these guidelines when creating or translating nodes:

1. **Base Files (In English)**:
   * By default, the main `prompt.md` and the `name` / `description` fields in `manifest.json` must be written in **English** (the standard language of technology).
   * The ID should be clean and suffix-free (e.g., `docker-hardening`).

2. **Localization (e.g., Portuguese, Spanish, etc.)**:
   * Do **NOT** create a separate skill folder or different ID for localized skills. Keep everything inside the same folder.
   * Add localized prompts by creating a new file with the language code suffix (e.g., `prompt.pt.md` for Portuguese).
   * Add localized metadata in `manifest.json` under the `locales` object using the corresponding language code.

**Example of manifest.json with localization:**
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

## 🚀 Submitting a Pull Request (PR)

1.  **Validate Your Code**: Run the CLI dashboard and make sure the new skill node is loaded in the interactive list without breaking the Neon-Cat mascot layout.
2.  Push your branch to your GitHub fork:
    ```bash
    git push origin feature/skill-my-new-skill
    ```
3.  Navigate to the original repository on GitHub and click **New Pull Request**.
4.  **PR Title**: Follow the Conventional Commits pattern (e.g., `feat(skill): added redis-expert`).
5.  **PR Description**:
    *   Describe the skill guidelines being added.
    *   State the triggers configured in the manifest.
    *   Confirm you ran the CLI dashboard locally.

The project governance team will review the PR within 48 hours! Thank you for contributing to the ecosystem. 🌲
