# 🌲 .skilltree

<p align="center">
  <img src="skill_tree_flow.png" alt="Skill Tree Flow" width="800">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@leosdc/skilltree"><img src="https://img.shields.io/npm/v/@leosdc/skilltree" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@leosdc/skilltree"><img src="https://img.shields.io/npm/dm/@leosdc/skilltree" alt="npm downloads"></a>
  <a href="https://github.com/Leosdc/skilltree/stargazers"><img src="https://img.shields.io/github/stars/Leosdc/skilltree" alt="GitHub stars"></a>
  <a href="https://github.com/Leosdc/skilltree/issues"><img src="https://img.shields.io/github/issues/Leosdc/skilltree" alt="GitHub issues"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="License: MIT"></a>
</p>

> The universal, community-driven skill tree repository for AI Agents.

_Read this in other languages: [Português (pt-BR)](README.pt-BR.md)_

`.skilltree` is a plug-and-play modular framework designed to live inside your workspace root. It serves as a localized capability branch that allows you to inject specialized nodes, automations, and advanced toolsets into any AI agent ecosystem (such as VSCode Copilot, Antigravity, Claude Code, Windsurf, and custom agentic workflows).

The repository is built entirely on the philosophy of **crowdsourced orchestration**: a massive, ever-growing tree of atomic skills, compiled dynamically to inject specialized rules into your IDE.

---

## 🚀 Concept & Architecture

Instead of managing fragmented configurations for different AI tools, you clone `.skilltree` directly into your active project directory as a hidden configuration module:

```bash
git clone https://github.com/Leosdc/skilltree.git .skilltree
```

Once embedded, the CLI compiler scans your workspace dependencies, compiles active skills into the exact local files your AI agents read (`.cursorrules`, `.clauderules`, `.windsurfrules`, `.copilot-instructions.md`, etc.), and **automatically synchronizes these rules with your global user-level AI configurations** (supporting Antigravity IDE, VS Code / Copilot, Cursor, and Windsurf global chats). This guarantees immediate adoption even by autonomous agentic workflows.

---

## 💡 Why `.skilltree`? (Vs. Traditional Method)

Traditionally, developers manage system instructions for AI agents in a fragmented, manual, and monolithic way. `.skilltree` introduces a modular, compiled, and team-ready paradigm:

| Feature | Traditional Method (Manual) | `.skilltree` Way |
| :--- | :--- | :--- |
| **Agent Fragmentation** | Developers must manually maintain separate rule files (`.cursorrules` for Cursor, `.clauderules` for Claude Code, `.windsurfrules` for Windsurf, `.github/copilot-instructions.md` for Copilot). | **Unified Rule Compilation:** The CLI compiler writes the consolidated prompt guidelines into all major rule vectors simultaneously. |
| **Monolithic Rules** | AI instructions are pasted into one giant, heavy file. This clutters the LLM's context window with unrelated rules (e.g. AWS rules in a frontend task). | **Atomic & Hot-Swappable Nodes:** Habilidades/Rules are organized as atomic directories. Toggle them on and off dynamically via the terminal. |
| **Discovery** | Passive. Developers must remember to find and copy rule templates. New team members are unaware of project guidelines. | **Autonomous Scanner:** The CLI parses package dependencies (`package.json`) and project files to automatically recommend skills to activate. |
| **Team Sync** | Rules are kept locally on each developer's machine, leading to outdated rules and lack of standardization. | **Git Versioned & Crowdsourced:** Lives inside the codebase as a subfolder. Prompt updates are synchronized across the team via Pull Requests. |
| **Security & Compliance** | Developers paste unverified prompts from the web, risking safety policy bypasses. | **Audited Tree Catalog:** Centralized security policies (e.g., OWASP compliance, secure Docker configurations) are enforced across the team. |

---

## 🛠️ Unified Cross-Agent Compatibility

`.skilltree` remains agent-agnostic. It standardizes skill schemas, generating both local workspace vectors and global system integrations:

| AI Agent | Injection Channel | Integration Type |
| :--- | :--- | :--- |
| **Antigravity IDE (Gemini)** | Global `user_rules.txt` & local `.cursorrules` | Dynamically synchronized on startup for autonomous agents to enforce project guidelines. |
| **Cursor** | `.cursor/rules/*.mdc` (Scoped) & `.cursorrules` | Supports smart compilation of individual `.mdc` rule files with glob triggers (frontmatter). |
| **VS Code (Copilot / Chat)** | Local `.copilot-instructions.md` & global `settings.json` | Injected into global chat custom instructions and GitHub Copilot workspace settings. |
| **Claude Code / Cowork** | `.clauderules` | Loaded dynamically by Anthropic's CLI agent terminal. |
| **Windsurf** | Local `.windsurfrules` & global `settings.json` | Read automatically by the Windsurf AI assistant locally and globally. |
| **OpenClawn / Custom** | `.clawnrules` & `active-tree.json` | Loaded by custom local terminal automation tools and orchestrators. |

---

## 🌐 Native Internationalization (i18n)

`.skilltree` supports multiple languages out-of-the-box, allowing teams worldwide to consume prompts and rules in their preferred language:

*   **Interactive Selector:** When first launched, the CLI prompts you to select your preferred language (e.g., English or Portuguese), which is saved in `.skilltree/config.json`. You can change it anytime via the CLI menu.
*   **Localized Compilation:** The compiler automatically reads localized prompt files (`prompt.<lang_code>.md` like `prompt.pt.md`) and translations from the skill's metadata (`locales` in `manifest.json`), compiling rules into the exact target files in the active language.
*   **Isolated Contexts:** Keeps prompt definitions separate by language, avoiding duplicate prompts in mixed languages in the LLM's context window.

---

## 📁 Repository Structure

```text
.skilltree/
├── bin/
│   └── skill-add.cjs            # The universal CLI tool (CommonJS)
├── tree/                        # Core catalog categorized by stack and scope
│   ├── backend/
│   │   └── postgres-expert/
│   ├── DevOps/
│   │   └── docker-hardening/
│   ├── security/
│   │   └── owasp-audit/
│   └── frontend/
│       └── react-security/
└── active-tree.json             # State management containing active skill IDs
```

---

## 🏁 Quick Start

### Option 1: Via NPM (Recommended)

1. Install the package [@leosdc/skilltree](https://www.npmjs.com/package/@leosdc/skilltree) in your project:
   ```bash
   npm i @leosdc/skilltree
   ```
2. Open the interactive dashboard:
   ```bash
   npx skilltree
   ```

### Option 2: Via Git Clone (Local)

1. **Clone** the repository as a `.skilltree` folder inside your project workspace:
   ```bash
   git clone https://github.com/Leosdc/skilltree.git .skilltree
   ```
2. **Run the Dashboard** using Node.js:
   ```bash
   node .skilltree/bin/skill-add.cjs
   ```

---

## 🎮 Controls & Commands

Use the **keyboard arrow keys (↑/↓/←/→)** to navigate the skills grid and action menu, press **[Space] or [Enter]** to toggle skill activation, press **[d] or [Delete]** to permanently delete a custom skill from your catalog (requires confirmation), and select bottom menu actions to run dependency scans or create skills manually.

If you prefer using direct CLI commands instead of the visual interface:
*   **Activate a skill**: `npx skilltree add <skill-id>` (or `node .skilltree/bin/skill-add.cjs add <skill-id>`)
*   **Deactivate a skill**: `npx skilltree remove <skill-id>`
*   **Delete a skill**: `npx skilltree delete <skill-id>`
*   **Run Automated Scan**: `npx skilltree scan`

---

## 🤝 Contributing to the Project

We want to expand the Skill Tree into the largest AI orchestration library in the world! If you want to submit new skills, improve security guidelines, or optimize our CLI engine, please check out our **[Contributing Guide (CONTRIBUTING.md)](CONTRIBUTING.md)**.

We outline our branch naming conventions (`feature/`, `bugfix/`), Conventional Commit standards, and prompt quality checklists.

---

For deep documentation on workspace integration, see [TUTORIAL.md](TUTORIAL.md).
For project history, see [CHANGELOG.md](CHANGELOG.md).
