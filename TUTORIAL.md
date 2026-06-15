# Skill Tree - Integration & Usage Guide

_Read this in other languages: [Português (pt-BR)](TUTORIAL.pt-BR.md)_

This tutorial guides you through installing, running, and customizing `.skilltree` across your development workspaces.

---

## 📦 How to Integrate into Your Projects

`.skilltree` is designed to be cloned directly inside your active project workspaces as a subdirectory named `.skilltree`. This allows you to track and version active skills on a per-project basis.

### Step 1: Clone into the project
Open your terminal in the root directory of the project you want to enhance, and run:
```bash
git clone https://github.com/Leosdc/skilltree.git .skilltree
```

### Step 2: Run the compiler CLI
Launch the interactive dashboard to manage rule nodes or use command-line parameters directly:
```bash
node .skilltree/.bin/skill-add.cjs
```
This script detects it is running inside a `.skilltree` subfolder and automatically updates the rules in your **parent project root** (e.g., creating `.cursorrules` and `.clauderules` in the parent directory).

---

## 🎮 Two Ways of Interacting (Menu vs. Command Line)

The Skill Tree utility offers two full interaction modes:

### 1. Visual Interactive Dashboard (Recommended)
Opens an interactive CLI dashboard directly in your terminal with dynamic keyboard navigation, displaying the original giant robot mascot and the skills organized in horizontal columns.
*   **How to open**:
    ```bash
    node .skilltree/.bin/skill-add.cjs
    # Or if you set up the alias:
    skill-add
    ```
*   **Controls**:
    *   **Arrow keys (↑ / ↓ / ← / →)**: Navigate the grid of available skills and the actions menu at the bottom.
    *   **Space / Enter (on a skill)**: Toggle the activation status (check/uncheck) of the selected workspace skill.
    *   **Enter (on an action)**: Instantly execute commands (such as running the automated scanner, creating manual skills, changing languages, or displaying JSON state).

### 2. Direct CLI Commands (Automation / No UI)
For developers who prefer command-line speed or want to automate rule compiling inside automation scripts and CI/CD pipelines.
*   **Initialize workspace structure**:
    ```bash
    node .skilltree/.bin/skill-add.cjs init
    ```
*   **List registered skills and their active status**:
    ```bash
    node .skilltree/.bin/skill-add.cjs list
    ```
*   **Activate a specific skill node by its ID**:
    ```bash
    node .skilltree/.bin/skill-add.cjs add <skill-id>
    # Example: node .skilltree/.bin/skill-add.cjs add postgres-expert
    ```
*   **Deactivate a specific skill node by its ID**:
    ```bash
    node .skilltree/.bin/skill-add.cjs remove <skill-id>
    # Example: node .skilltree/.bin/skill-add.cjs remove postgres-expert
    ```
*   **Create a custom skill via text prompts**:
    ```bash
    node .skilltree/.bin/skill-add.cjs create
    ```
*   **Run the automated codebase dependency/extension scanner**:
    ```bash
    node .skilltree/.bin/skill-add.cjs scan
    ```

---

## ⚡ Global Terminal Shortcuts (Aliases)

To avoid typing the full path every time, you can bind the command globally in your terminal shell.

### On Windows (PowerShell)
Add the following to your PowerShell profile (find it by running `$PROFILE`):
```powershell
function skill-add {
    if (Test-Path ".skilltree\.bin\skill-add.cjs") {
        node .skilltree\.bin\skill-add.cjs $args
    } else {
        Write-Host "🌲 .skilltree subfolder not found in this directory. Clone it first." -ForegroundColor Yellow
    }
}
```

### On macOS / Linux (Bash or Zsh)
Add this to your `~/.bashrc` or `~/.zshrc`:
```bash
alias skill-add="node .skilltree/.bin/skill-add.cjs"
```
Now, in any project that contains the `.skilltree` folder, you can simply run:
```bash
skill-add
```

---

## 🤖 How the Agents Load the Rules

When you activate a skill node (via menu or CLI command), the compiler bundles the instructions and injects them into specific locations, supporting both **Local and Global** configurations:

### 📍 Locally (Workspace)
Consolidated rules are written directly into workspace configuration files:
1. **Cursor IDE:** Compiles smart individual `.mdc` files inside `.cursor/rules/` (using YAML frontmatter with scoped glob triggers), alongside the legacy `.cursorrules` in the project root.
2. **Claude Code CLI:** Reads `.clauderules` in the folder root.
3. **VS Code (GitHub Copilot):** Consumes directives from `.github/copilot-instructions.md` or `.copilot-instructions.md`.
4. **Windsurf IDE:** Automatically parses `.windsurfrules`.

### 🌐 Globally (System / User Level)
To ensure that autonomous agents (like the Antigravity IDE) or global AI chat sessions (like VS Code Chat or Cursor Chat) immediately pick up your project's active skills without relying on local indexing, the Skill Tree CLI performs a **non-blocking global synchronization**:
* **Antigravity IDE (Gemini):** Injects a governance directive into `~/.gemini/antigravity-ide/user_rules.txt` forcing the dynamic loading of the local Skill Tree whenever a `.skilltree` folder is detected in the active workspace.
* **VS Code, Cursor, and Windsurf:** Silently updates global user-level configurations (`settings.json`) adding custom AI instruction hooks (`github.copilot.chat.customInstructions`, `google.gemini.customInstructions`, etc.) to guide the AI to inspect the active local skill tree.

---

## 🧬 Creating Custom Skill Nodes

You can easily expand the tree with custom instructions tailored for your projects.

1. In the terminal, run the creation CLI:
   ```bash
   node .skilltree/.bin/skill-add.cjs create
   ```
2. Enter the skill name (e.g., `redis-caching`) and category (e.g., `backend`).
3. The tool generates:
   - `tree/backend/redis-caching/manifest.json` (metadata and triggers).
   - `tree/backend/redis-caching/prompt.md` (the prompt guidelines in your CLI's active language).
4. **Follow the Multi-Language Structure Convention (MANDATORY for global catalogs):**
   To make your skill node accessible to global teams, structure it as follows:
   *   **Base prompt in English:** Save it in `prompt.md` (the standard language for tech).
   *   **Localized prompt (e.g., Portuguese):** Save it as `prompt.pt.md`.
   *   **Manifest Metadata:** Provide standard `name` and `description` in English at the root level of `manifest.json`, and localized variants under the `locales` object:
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
5. Edit the files to define custom triggers and instructions. Your new skill will instantly appear in the menu, adapting itself dynamically to the developer's selected CLI language!
