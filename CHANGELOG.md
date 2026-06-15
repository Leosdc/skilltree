# Changelog

All notable changes to this project will be documented in this file.

---

## [0.1.0] - 2026-06-14

### Added / Adicionado
- **Universal Agent Compilation / Compilação Universal para Agentes:** The CLI compiler now generates instructions for Cursor (`.cursorrules`), Claude Code (`.clauderules`), Windsurf (`.windsurfrules`), GitHub Copilot (`.copilot-instructions.md` / `.github/copilot-instructions.md`), and Clawn (`.clawnrules`). / *O compilador agora gera regras unificadas para todos os principais agentes de IDE e CLI.*
- **Workspace Root Auto-Detection / Detecção Automática do Projeto:** Added logic to resolve host project parent directory when cloned as a `.skilltree` subdirectory. / *Detecção dinâmica da raiz do projeto hospedeiro ao clonar a Skill Tree como subpasta.*
- **Custom Mascot ASCII Art / Arte ASCII do Mascote:** Integrated user's robotic cat-ant mascot into CLI welcome screen with neon cyan and magenta gradient colors. / *Arte ASCII oficial do mascote do usuário adicionada ao cabeçalho do console em degradê ciano/magenta.*
- **Autonomous Project Scan / Scanner Autônomo:** Auto-detects dependencies and files in host projects to suggest skills to unlock. / *Varredura automática de dependências e arquivos para sugerir ativações.*

### Changed / Alterado
- **CJS File Extension / Extensão `.cjs`:** Renamed CLI to `skill-add.cjs` to override ES module scopes in client projects. / *Renomeado para `.cjs` para evitar erros de importação em projetos de tipo módulo.*