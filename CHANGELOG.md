# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-06-24

### Added / Adicionado
- **Flowgrammers Skills Integration / Integração de Skills do Flowgrammers:** Integrated 365 production-ready skills from Ric Neves' flowgrammers-skills repository, significantly expanding the catalog across categories like marketing, copywriting, C-level advisor, product management, and development. / *Integração de 365 novas skills prontas para produção do repositório flowgrammers-skills do Ric Neves, expandindo severamente o catálogo da Skill Tree em áreas como marketing, copy, assessoria executiva, gestão de produtos e código.*
- **README Credits / Créditos nos READMEs:** Included dedication and thanks sections to Ric Neves in both English and Portuguese READMEs. / *Adicionados agradecimentos e créditos dedicados ao Ric Neves nos READMEs em inglês e português.*

---

## [1.0.5] - 2026-06-19

### Added / Adicionado
- **Claude Code Native Integration (`CLAUDE.md`) / Integração Nativa com Claude Code (`CLAUDE.md`):** Added native compilation support for `CLAUDE.md` in the project root, solving the audit issue where `.clauderules` was ignored by the Claude Code CLI. / *Adicionado suporte de compilação nativa para `CLAUDE.md` na raiz do projeto, corrigindo o problema de auditoria onde o arquivo `.clauderules` era ignorado pelo Claude Code.*

### Changed / Alterado
- **Documentation Overhaul / Atualização de Documentação:** Replaced primary references of `.clauderules` with `CLAUDE.md` across READMEs, Tutorials and contributing guidelines in both English and Portuguese. / *Substituição das referências principais de `.clauderules` por `CLAUDE.md` nos READMEs, Tutoriais e guias de contribuição em inglês e português.*

---

## [0.1.0] - 2026-06-14

### Added / Adicionado
- **Universal Agent Compilation / Compilação Universal para Agentes:** The CLI compiler now generates instructions for Cursor (`.cursorrules`), Claude Code (`.clauderules`), Windsurf (`.windsurfrules`), GitHub Copilot (`.copilot-instructions.md` / `.github/copilot-instructions.md`), and Clawn (`.clawnrules`). / *O compilador agora gera regras unificadas para todos os principais agentes de IDE e CLI.*
- **Workspace Root Auto-Detection / Detecção Automática do Projeto:** Added logic to resolve host project parent directory when cloned as a `.skilltree` subdirectory. / *Detecção dinâmica da raiz do projeto hospedeiro ao clonar a Skill Tree como subpasta.*
- **Custom Mascot ASCII Art / Arte ASCII do Mascote:** Integrated user's robotic cat-ant mascot into CLI welcome screen with neon cyan and magenta gradient colors. / *Arte ASCII oficial do mascote do usuário adicionada ao cabeçalho do console em degradê ciano/magenta.*
- **Autonomous Project Scan / Scanner Autônomo:** Auto-detects dependencies and files in host projects to suggest skills to unlock. / *Varredura automática de dependências e arquivos para sugerir ativações.*

### Changed / Alterado
- **CJS File Extension / Extensão `.cjs`:** Renamed CLI to `skill-add.cjs` to override ES module scopes in client projects. / *Renomeado para `.cjs` para evitar erros de importação em projetos de tipo módulo.*