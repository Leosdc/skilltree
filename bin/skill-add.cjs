#!/usr/bin/env node

/**
 * 🌲 .skilltree CLI & IDE Plugin Integration
 * Ferramenta oficial para gerenciamento de habilidades de IA no workspace.
 * Estilizada com a paleta do mascote Ant-Bot V2 (Neon Cyan & Neon Magenta).
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configurações de cores ANSI baseadas no mascote
const CYAN = '\x1b[96m';
const MAGENTA = '\x1b[95m';
const YELLOW = '\x1b[93m';
const GREEN = '\x1b[92m';
const RED = '\x1b[91m';
const GRAY = '\x1b[90m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Diretórios principais
const WORKSPACE_DIR = path.resolve(__dirname, '..');
const TREE_DIR = path.join(WORKSPACE_DIR, 'tree');
const ACTIVE_JSON_PATH = path.join(WORKSPACE_DIR, 'active-tree.json');
const CONFIG_PATH = path.join(WORKSPACE_DIR, 'config.json');

let currentLang = 'en'; // Padrão

// Dicionário i18n para suporte multi-idiomas
const TRANSLATIONS = {
  en: {
    panelTitle: "Workspace Skill Panel (Navigate ↑/↓/←/→, select/deselect with [Space] or [Enter], delete with [d] or [Delete]):",
    actionsTitle: "AVAILABLE ACTIONS",
    actionScan: "🔍  Run Code Scan (Scan)",
    actionCreate: "🛠️  Create New Skill (Manual)",
    actionJson: "📄  View active-tree.json",
    actionExit: "❌  Exit Tool",
    actionLang: "🌐  Change Language",
    scanTitle: "Running automatic workspace scan...",
    noRecommendations: "No specific recommendations for detected technologies at this time.",
    recommendedSkills: "Recommended Skills Found:",
    reason: "Reason:",
    actionSuggested: "Suggested action:",
    createTitle: "Create New Local Skill (Manual Entry)",
    langTip1: "Tip: The tool will create a manifest.json and a prompt.md in the selected category.",
    langTip2: "You can add localized prompts (e.g. prompt.pt.md) and locales metadata later.",
    namePrompt: "Skill Name: ",
    catPrompt: "Select Category: ",
    invalidName: "Error: Invalid name.",
    duplicateSkill: "Error: A skill with ID '{id}' already exists.",
    skillCreated: "Skill created successfully at: {path}",
    pressAnyKey: "Press any key to return to the menu...",
    syncSuccess: "Automatic sync: Skill activated in Antigravity IDE globally.",
    editorSync: "Automatic sync: Skill activated in {editor} globally.",
    syncFail: "Could not update global Antigravity rules: {error}",
    activeLabel: "[Active]",
    inactiveLabel: "[Inactive]",
    statusOnline: "Online & Protected",
    targetProject: "Target Project:",
    environment: "Environment:",
    thanks: "Thanks for using .skilltree! Synchronization complete.",
    initMsg: "Initializing Skill Tree structure...",
    dirCreated: "Skill directory tree/ created.",
    stateCreated: "State file active-tree.json created.",
    stateExists: "State file active-tree.json already exists.",
    initSuccess: "Structure successfully initialized!",
    tryMenu: "Try running: node .bin/skill-add.cjs menu to manage skills.",
    jsonStateTitle: "Current state of active-tree.json:",
    jsonNotFound: "File not found.",
    validationFail: "Could not sync .cursor/rules/ directory: {error}",
    runAddCommand: "Run: node .bin/skill-add.cjs add {id}",
    listTitle: "Registered Skills:",
    listActive: "Active",
    listInactive: "Inactive",
    addErrId: "Error: Provide the skill ID. E.g.: node .bin/skill-add.cjs add postgres-expert",
    addErrNotExist: "Error: skill '{id}' does not exist in the tree/ catalog.",
    addSuccess: "✔ Skill '{id}' activated and compiled successfully!",
    addAlreadyActive: "ℹ Skill '{id}' is already active.",
    removeErrId: "Error: Provide the skill ID. E.g.: node .bin/skill-add.cjs remove postgres-expert",
    removeSuccess: "✔ Skill '{id}' removed and rule files updated!",
    removeAlreadyInactive: "ℹ Skill '{id}' was already inactive.",
    scanReasonExtension: "Found file with extension {ext}",
    scanReasonConfig: "Found configuration file {file}",
    scanReasonDependency: "Detected dependency '{dep}' in package.json",
    deleteErrId: "Error: Provide the skill ID. E.g.: node .bin/skill-add.cjs delete postgres-expert",
    deleteErrNotExist: "Error: skill '{id}' does not exist in the tree/ catalog.",
    deleteConfirm: "Are you sure you want to delete the skill '{id}'? (y/N): ",
    deleteSuccess: "✔ Skill '{id}' deleted successfully from the catalog!",
    deleteCancelled: "Deletion cancelled.",
    deleteConfirmTitle: "Delete Skill (Confirmation)",
    deleteErr: "Error deleting skill: {error}"
  },
  pt: {
    panelTitle: "Painel de Habilidades do Workspace (Navegue com ↑/↓/←/→, marque/desmarque com [Espaço] ou [Enter], apague com [d] ou [Delete]):",
    actionsTitle: "AÇÕES DISPONÍVEIS",
    actionScan: "🔍  Executar Varredura de Código (Scan)",
    actionCreate: "🛠️  Criar Nova Habilidade (Manual)",
    actionJson: "📄  Visualizar active-tree.json",
    actionExit: "❌  Sair da ferramenta",
    actionLang: "🌐  Alterar Idioma",
    scanTitle: "Iniciando varredura automática do workspace...",
    noRecommendations: "Nenhuma recomendação específica para as tecnologias encontradas no momento.",
    recommendedSkills: "Habilidades Recomendadas Encontradas:",
    reason: "Motivo:",
    actionSuggested: "Ação sugerida:",
    createTitle: "Criar Nova Habilidade Local (Preenchimento Manual)",
    langTip1: "Dica: A ferramenta criará os arquivos manifest.json e prompt.md na categoria selecionada.",
    langTip2: "Você poderá adicionar prompts localizados (ex: prompt.pt.md) e metadados de tradução depois.",
    namePrompt: "Nome da Habilidade: ",
    catPrompt: "Selecione a Categoria: ",
    invalidName: "Erro: Nome inválido.",
    duplicateSkill: "Erro: Uma habilidade com o ID '{id}' já existe.",
    skillCreated: "Habilidade criada com sucesso em: {path}",
    pressAnyKey: "Pressione qualquer tecla para retornar ao menu...",
    syncSuccess: "Sincronização automática: Habilidade ativada no Antigravity IDE globalmente.",
    editorSync: "Sincronização automática: Habilidade ativada no {editor} globalmente.",
    syncFail: "Não foi possível atualizar as regras globais do Antigravity IDE: {error}",
    activeLabel: "[Ativo]",
    inactiveLabel: "[Inativo]",
    statusOnline: "Online & Protegido",
    targetProject: "Projeto Alvo:",
    environment: "Ambiente:",
    thanks: "Obrigado por usar o .skilltree! Sincronização concluída.",
    initMsg: "Inicializando estrutura da Skill Tree...",
    dirCreated: "Diretório de habilidades tree/ criado.",
    stateCreated: "Arquivo de estado active-tree.json criado.",
    stateExists: "O arquivo de estado active-tree.json já existe.",
    initSuccess: "Estrutura inicializada com sucesso!",
    tryMenu: "Tente executar: node .bin/skill-add.cjs menu para gerenciar habilidades.",
    jsonStateTitle: "Estado atual do active-tree.json:",
    jsonNotFound: "Arquivo não encontrado.",
    validationFail: "Não foi possível sincronizar o diretório .cursor/rules/: {error}",
    runAddCommand: "Executar: node .bin/skill-add.cjs add {id}",
    listTitle: "Habilidades Cadastradas:",
    listActive: "Ativa",
    listInactive: "Inativa",
    addErrId: "Erro: informe o ID da habilidade. Ex: node .bin/skill-add.cjs add postgres-expert",
    addErrNotExist: "Erro: habilidade '{id}' não existe no catálogo tree/.",
    addSuccess: "✔ Habilidade '{id}' ativada e compilada com sucesso!",
    addAlreadyActive: "ℹ Habilidade '{id}' já está ativa.",
    removeErrId: "Erro: informe o ID da habilidade. Ex: node .bin/skill-add.cjs remove postgres-expert",
    removeSuccess: "✔ Habilidade '{id}' removida e arquivos de regras atualizados!",
    removeAlreadyInactive: "ℹ Habilidade '{id}' já estava inativa.",
    scanReasonExtension: "Encontrado arquivo com extensão {ext}",
    scanReasonConfig: "Encontrado arquivo de configuração {file}",
    scanReasonDependency: "Detectada a dependência '{dep}' no package.json",
    deleteErrId: "Erro: informe o ID da habilidade. Ex: node .bin/skill-add.cjs delete postgres-expert",
    deleteErrNotExist: "Erro: habilidade '{id}' não existe no catálogo tree/.",
    deleteConfirm: "Tem certeza de que deseja apagar a habilidade '{id}'? (s/N): ",
    deleteSuccess: "✔ Habilidade '{id}' apagada com sucesso do catálogo!",
    deleteCancelled: "Exclusão cancelada.",
    deleteConfirmTitle: "Excluir Habilidade (Confirmação)",
    deleteErr: "Erro ao apagar habilidade: {error}"
  }
};

function t(key, replacements = {}) {
  let str = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  for (const [k, v] of Object.entries(replacements)) {
    str = str.replace(new RegExp(`{${k}}`, 'g'), v);
  }
  return str;
}

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      if (data.language) {
        currentLang = data.language;
        return true;
      }
    } catch (e) {}
  }
  return false;
}

function changeLanguageFlow(callback) {
  if (!process.stdout.isTTY) {
    currentLang = 'en';
    return callback();
  }

  const options = [
    { code: 'en', label: 'English (EN)' },
    { code: 'pt', label: 'Português (PT-BR)' }
  ];
  let localSelectedIndex = 0;

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  function renderLangMenu() {
    printHeader(true);
    console.log(`${BOLD}${CYAN}Choose your language / Escolha seu idioma:${RESET}\n`);
    for (let i = 0; i < options.length; i++) {
      const isSelected = i === localSelectedIndex;
      const cursor = isSelected ? `${BOLD}${MAGENTA}▶ ${RESET}` : '  ';
      const textStyle = isSelected ? `${BOLD}${CYAN}` : '';
      console.log(`${cursor}${textStyle}${options[i].label}${RESET}`);
    }
    console.log();
  }

  renderLangMenu();

  const handleLangKey = (str, key) => {
    if (!key) return;

    if (key.ctrl && key.name === 'c') {
      process.stdin.removeListener('keypress', handleLangKey);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.exit(0);
    }

    if (key.name === 'up' || key.name === 'down') {
      localSelectedIndex = localSelectedIndex === 0 ? 1 : 0;
      renderLangMenu();
    } else if (key.name === 'space' || key.name === 'return') {
      process.stdin.removeListener('keypress', handleLangKey);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      
      const selectedLang = options[localSelectedIndex].code;
      try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({ language: selectedLang }, null, 2), 'utf8');
      } catch (e) {}

      currentLang = selectedLang;
      setTimeout(() => {
        callback();
      }, 100);
    }
  };

  process.stdin.on('keypress', handleLangKey);
}

function checkLanguageAndRun(callback) {
  if (loadConfig()) {
    return callback();
  }
  changeLanguageFlow(callback);
}

// LÓGICA DE DETECÇÃO DO WORKSPACE HOST:
// Resolve recursivamente o diretório raiz do projeto hospedeiro subindo a árvore de pastas
// se o script estiver sendo executado dentro de node_modules ou de uma subpasta .skilltree.
function resolveProjectRoot(workspaceDir) {
  let current = workspaceDir;
  while (true) {
    const parent = path.dirname(current);
    if (parent === current) break; // Chegou na raiz do sistema de arquivos
    
    const base = path.basename(current).toLowerCase();
    const parentBase = path.basename(parent).toLowerCase();
    
    if (base === 'node_modules' || base === '.skilltree') {
      return parent;
    }
    if (parentBase === 'node_modules' || parentBase === '.skilltree') {
      return path.dirname(parent);
    }
    current = parent;
  }
  return workspaceDir;
}

const PROJECT_ROOT = resolveProjectRoot(WORKSPACE_DIR);

// Estado global para controlar exibição do mascote gigante
let isFirstMenuPrint = true;

// Marcadores de segurança para não sobrescrever regras personalizadas do desenvolvedor
const MARKER_START = '### 🌲 --- SKILLTREE SECTION START (DO NOT EDIT) ---';
const MARKER_END = '### 🌲 --- SKILLTREE SECTION END ---';

// Arte ASCII oficial do Mascote do Usuário (Cat-Ant Cyborg)
const MASCOT_ART_LINES = [
  "                                 ----=                                   =:::-                                ",
  "                                ++**+----                            -----+**++                               ",
  "                               =+#%*#*+=+=-=                       --++=**#*#*+                               ",
  "                               ++#%**%**++++--   +=---------=*   --+++*###**%*+#                              ",
  "                               =**++#*%%#*+**==++=++========+=+=-=**+*###+*++*++                              ",
  "                               =*#****###**===-**=+++++++++++=*+-===**#******#+=                              ",
  "                               =*#*#*#+++*+===-**+=+++++++++=**+-===**+*+%#**#+=                              ",
  "                               =+##**#+*+*+===---***+****++**+---==++++*+*+*#*+=                              ",
  "                               ++#+#*+*++++=====---***###***---=====*+++*+**+*=*                              ",
  "                                =+##+***+=*+=++====---------====++=++++***+#*==                               ",
  "                               ++#**#+##****=+++++++++++++++++++++=***###=*+**=                               ",
  "                              +-++#*###*----::--:::::::::::::::------==*##*+*++-                              ",
  "                              -+**+#+=+*##*++++++++===========+*****####*=+#***+=                             ",
  "                             ---***-+#+====+========-----====++++****+++*#+=***---                            ",
  "                            --=:---=*+++++-:---========-===+++++---:-******===-:--=                           ",
  "                            =++==++=*++++-:=-**-======--=-==++=--=##:-+++**+++=-===                           ",
  "                            ===*+**=+===-:-****+-=-----------=-=****=:-===++**+====                           ",
  "                            =*+**##=+-==-:-++++--====-----====--++++-:-==-++###+=+-                           ",
  "                             =+*##*=+----:::==-:------===------:-==-::----++**#++=                            ",
  "                              ++*%##===----:::-----=--*+*--=-----:::----+++###*+=                             ",
  "                     %%%        *###*+===========-:::::::::::-===========+*##*+        %%%%                   ",
  "                   %#===#===    ++*##*=====----:::::-:::::--::::----=====+##+==    -==++--=%                  ",
  "                   %#===#+**++=   +*###++==-------::::-:-::::-------===+*#*+=    =++****++*%                  ",
  "                     %%%     +*+-   +**###*+======-----------======+**##*+=     +*+     %%@                   ",
  "                               *==*   +***####**+++++++++++++++**###**++      #==*                            ",
  "                               +=+#          #######%###########**             **+                            ",
  "                        ====   ***=          -=+*##**##%%%%#%##+*+=            =*+   %#*%%                    ",
  "                  %#*++*****+=  **++       -=++++**+===++***++===**=        == +*+  %*::+%                    ",
  "                  %=.-*%    *=+  ***+++ =+===*####*++===-----===++*+==+----++++*+    =*#%%                    ",
  "                  @%##%      +*#   ******+*###*+*#***+==-==-=-=+++###**+++*#*+++    ++*                       ",
  "                              *+=------+*+=-=+  =##****+++***++*+*###**#****++    =+*+                        ",
  "                            =-===-----==*+===+*+++**#%***+***++**= *###**      =+**+                          ",
  "                           =++=+=++=+==+*++**++##********+*****++    ****####*****                            ",
  "                           *#**+++*****#*##*###%=#%#+**#*+==*+*+=        ++                                   ",
  "                           +*#*#**+==++=*#=:-+*%+**=+*+=**###++++ *=--==++===                                 ",
  "                             ++%#==+#***++-=+**##+*+++#**+++*#***#**+==##*#+==                                ",
  "                              **+=+*#+*##==+*##+===*########***++*##++=+* #*+==                               ",
  "                               -=+##**+##-+***##*+*###****##*#*+*##**+==  *##+=                               ",
  "                               =+*#* +++==+****##****** ##%##***#*#***+==  *#*+=                              ",
  "                              ++##*     -+***   ##       ###*  #*   ***==   *#*++                             ",
  "                              #*#      +***              ##*       ***++     ##+                             ",
  "                             =**       =+**                #*        **++      **=                            ",
  "                             #         -**                            **+        *                            ",
  "                                        *#                             #*                                     "
];

// Inicializa a leitura do console somente quando necessário em subprompts


function detectEnvironment() {
  const env = process.env;
  
  // Scans all environment variables keys and values in lowercase for identifiers
  const envString = Object.entries(env)
    .map(([key, val]) => `${key}=${val}`)
    .join('\n')
    .toLowerCase();

  if (envString.includes('antigravity')) {
    return 'Antigravity IDE';
  }
  
  if (envString.includes('cursor')) {
    return 'Cursor IDE';
  }

  if (envString.includes('windsurf')) {
    return 'Windsurf IDE';
  }

  if (env.TERM_PROGRAM === 'vscode' || envString.includes('vscode') || envString.includes('code')) {
    return 'VS Code';
  }

  return 'Terminal Externo';
}

function printHeader(showMascot = true) {
  // Limpa a tela de forma nativa e robusta, e apaga o histórico de rolagem no VS Code para evitar duplicações
  if (process.stdout.isTTY) {
    console.clear();
    process.stdout.write('\x1b[3J');
  } else {
    process.stdout.write('\x1b[H\x1b[J');
  }
  
  const currentEnv = detectEnvironment();

  // Trunca/Encurta o caminho do projeto para exibição caso seja muito longo (evitando quebras de layout)
  let displayPath = PROJECT_ROOT;
  if (displayPath.length > 40) {
    const parts = displayPath.split(path.sep);
    if (parts.length > 3) {
      displayPath = '...' + path.sep + parts.slice(-2).join(path.sep);
    }
  }
  
  if (showMascot) {
    // Imprime a arte ASCII GIGANTE com coloração neon em degradê ciano e magenta
    for (let i = 0; i < MASCOT_ART_LINES.length; i++) {
      const line = MASCOT_ART_LINES[i].trimEnd();
      let color = CYAN;

      if (i >= 11 && i <= 19) color = MAGENTA;
      else if (i >= 24 && i <= 27) color = MAGENTA;
      else if (i >= 20 && i <= 23) color = CYAN;
      else if (i >= 28) color = i % 2 === 0 ? CYAN : MAGENTA;

      console.log(color + line + RESET);
    }
    
    // Imprime as informações detalhadas de status e projeto abaixo do mascote
    console.log(`\n 🌲 ${BOLD}${MAGENTA}.skilltree CLI & IDE Plugin${RESET}`);
    console.log(`    ${GRAY}${currentLang === 'pt' ? "Interface de Habilidades do Agente de IA" : "AI Agent Skill Interface"}${RESET}`);
    console.log(`    ${CYAN}${currentLang === 'pt' ? "Paleta Mascote: Ciano & Magenta Neon" : "Mascot Palette: Neon Cyan & Neon Magenta"}${RESET}\n`);
    console.log(`    ${BOLD}Status:${RESET} ${GREEN}${t('statusOnline')}${RESET}`);
    console.log(`    ${BOLD}${t('targetProject')}${RESET} ${GRAY}${displayPath}${RESET}`);
    console.log(`    ${BOLD}${t('environment')}${RESET} ${MAGENTA}${currentEnv}${RESET}`);
    console.log(`\n${GRAY}════════════════════════════════════════════════════════════════════════════════════════════════════${RESET}\n`);
  } else {
    // Modo Compacto (Evita spam do mascote no terminal quando redesenhando o menu de navegação)
    console.log(`🌲 ${BOLD}${CYAN}.skilltree${RESET} | ${t('targetProject')} ${GRAY}${displayPath}${RESET} | ${t('environment')} ${MAGENTA}${currentEnv}${RESET} | Status: ${GREEN}${t('statusOnline')}${RESET}`);
    console.log(`${GRAY}════════════════════════════════════════════════════════════════════════════════════════════════════${RESET}\n`);
  }
}

// 1. Inicialização do ambiente
function initWorkspace() {
  printHeader(true);
  console.log(`${CYAN}${BOLD}[INIT]${RESET} ${t('initMsg')}`);

  if (!fs.existsSync(TREE_DIR)) {
    fs.mkdirSync(TREE_DIR, { recursive: true });
    console.log(`${GREEN}✔${RESET} ${t('dirCreated')}`);
  }

  if (!fs.existsSync(ACTIVE_JSON_PATH)) {
    fs.writeFileSync(ACTIVE_JSON_PATH, JSON.stringify({ active: [] }, null, 2));
    console.log(`${GREEN}✔${RESET} ${t('stateCreated')}`);
  } else {
    console.log(`${YELLOW}ℹ${RESET} ${t('stateExists')}`);
  }

  console.log(`\n${GREEN}${BOLD}${t('initSuccess')}${RESET}`);
  console.log(`${t('tryMenu')}\n`);
  process.exit(0);
}

// 2. Busca todas as habilidades disponíveis no catálogo local
function loadAvailableSkills() {
  const skills = [];
  if (!fs.existsSync(TREE_DIR)) return skills;

  function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const manifestPath = path.join(fullPath, 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // Busca o prompt localizado primeiro, senão usa o prompt.md padrão
            let resolvedPromptPath = path.join(fullPath, `prompt.${currentLang}.md`);
            if (!fs.existsSync(resolvedPromptPath)) {
              resolvedPromptPath = path.join(fullPath, 'prompt.md');
            }

            if (fs.existsSync(resolvedPromptPath)) {
              let name = manifest.name;
              let description = manifest.description;

              // Aplica tradução dos metadados caso estejam presentes no manifest
              if (manifest.locales && manifest.locales[currentLang]) {
                if (manifest.locales[currentLang].name) {
                  name = manifest.locales[currentLang].name;
                }
                if (manifest.locales[currentLang].description) {
                  description = manifest.locales[currentLang].description;
                }
              }

              skills.push({
                ...manifest,
                name,
                description,
                promptPath: resolvedPromptPath,
                dirPath: fullPath
              });
            }
          } catch (e) {
            // Silencia erro de leitura individual para não interromper carregamento
          }
        } else {
          traverse(fullPath);
        }
      }
    }
  }

  traverse(TREE_DIR);
  return skills;
}


// 3. Lê o arquivo de estado ativo
function loadActiveIds() {
  if (!fs.existsSync(ACTIVE_JSON_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(ACTIVE_JSON_PATH, 'utf8'));
    return data.active || [];
  } catch (e) {
    return [];
  }
}

// 4. Salva a árvore ativa e compila as diretrizes da IDE
function saveActiveSkills(activeIds) {
  // Salva no JSON local
  fs.writeFileSync(ACTIVE_JSON_PATH, JSON.stringify({ active: activeIds }, null, 2));

  // Compila os prompts de todas as habilidades ativas
  const skills = loadAvailableSkills();
  const activeSkills = skills.filter(s => activeIds.includes(s.id));

  let compiledContent = `${MARKER_START}\n`;
  compiledContent += `<!-- AI RULES - GENERATED BY SKILLTREE -->\n`;
  compiledContent += `<!-- Ultima atualizacao: ${new Date().toISOString()} -->\n\n`;

  if (activeSkills.length === 0) {
    compiledContent += `<!-- Nenhuma habilidade ativada no momento. -->\n`;
  } else {
    for (const skill of activeSkills) {
      compiledContent += `<skill id="${skill.id}" name="${skill.name}" category="${skill.category}">\n`;
      compiledContent += `  <description>${skill.description}</description>\n`;
      compiledContent += `  <instructions>\n`;
      try {
        const promptText = fs.readFileSync(skill.promptPath, 'utf8');
        // Indenta as instruções para manter a estrutura limpa da tag
        const indentedPrompt = promptText.split('\n').map(line => '    ' + line).join('\n');
        compiledContent += `${indentedPrompt}\n`;
      } catch (e) {
        compiledContent += `    <!-- Erro ao carregar o prompt da habilidade: ${skill.id} -->\n`;
      }
      compiledContent += `  </instructions>\n`;
      compiledContent += `</skill>\n\n`;
    }
  }
  compiledContent += `${MARKER_END}\n`;

  // Mapeamento de múltiplos vetores de regras para suportar todos os agentes de IA
  const targetRuleFiles = [
    '.cursorrules',              // Cursor & VS Code (agente nativo do Cursor)
    '.clauderules',              // Claude Code & Claude Cowork
    '.windsurfrules',            // Windsurf IDE
    '.copilot-instructions.md',   // GitHub Copilot (novas versões)
    '.github/copilot-instructions.md', // GitHub Copilot (padrão VS Code/GitHub)
    '.clawnrules'                // OpenClawn e clientes customizados
  ];

  for (const ruleFile of targetRuleFiles) {
    const fullPath = path.join(PROJECT_ROOT, ruleFile);
    // Cria diretório pai (.github) se necessário
    const parentDir = path.dirname(fullPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    updateRuleFile(fullPath, compiledContent);
  }

  // Compilação inteligente para o formato moderno de regras do Cursor (.cursor/rules/*.mdc)
  const cursorRulesDir = path.join(PROJECT_ROOT, '.cursor', 'rules');
  try {
    if (!fs.existsSync(cursorRulesDir)) {
      fs.mkdirSync(cursorRulesDir, { recursive: true });
    }

    const allCatalogSkills = loadAvailableSkills();

    // Limpa arquivos .mdc de habilidades conhecidas que não estão ativas
    if (fs.existsSync(cursorRulesDir)) {
      const existingFiles = fs.readdirSync(cursorRulesDir);
      for (const file of existingFiles) {
        if (file.endsWith('.mdc')) {
          const skillId = path.basename(file, '.mdc');
          const isFromCatalog = allCatalogSkills.some(s => s.id === skillId);
          const isActive = activeIds.includes(skillId);
          if (isFromCatalog && !isActive) {
            fs.unlinkSync(path.join(cursorRulesDir, file));
          }
        }
      }
    }

    // Escreve os arquivos .mdc para cada habilidade ativa
    for (const skill of activeSkills) {
      const mdcPath = path.join(cursorRulesDir, `${skill.id}.mdc`);
      const filesGlob = skill.triggers && skill.triggers.files ? skill.triggers.files : [];
      const alwaysApply = filesGlob.length === 0;

      let mdcContent = '---\n';
      mdcContent += `description: "${skill.description.replace(/"/g, '\\"')}"\n`;
      if (filesGlob.length > 0) {
        mdcContent += `globs: [${filesGlob.map(g => `"${g}"`).join(', ')}]\n`;
      }
      mdcContent += `alwaysApply: ${alwaysApply}\n`;
      mdcContent += '---\n\n';

      try {
        const promptText = fs.readFileSync(skill.promptPath, 'utf8');
        mdcContent += promptText;
      } catch (e) {
        mdcContent += `<!-- Erro ao carregar o prompt da habilidade: ${skill.id} -->\n`;
      }

      fs.writeFileSync(mdcPath, mdcContent.trim() + '\n', 'utf8');
    }
  } catch (err) {
    console.log(`\n${YELLOW}⚠${RESET} Não foi possível sincronizar o diretório .cursor/rules/: ${err.message}`);
  }

  // Sincroniza com as configurações globais do Antigravity IDE
  syncWithAIEnvironments();
}

/**
 * Sincroniza as regras ativas da Skill Tree com o ambiente global do Antigravity IDE, VS Code, Cursor e Windsurf.
 * Garante que a IA de desenvolvimento leia e respeite as skills do workspace local de forma automática.
 */
function syncWithAIEnvironments() {
  const homeDir = process.env.USERPROFILE || process.env.HOME || '';
  if (!homeDir) return;

  const geminiRulesPath = path.join(homeDir, '.gemini', 'antigravity-ide', 'user_rules.txt');
  
  const markerStart = '### 🌲 --- SKILLTREE INTEGRATION START (DO NOT EDIT) ---';
  const markerEnd = '### 🌲 --- SKILLTREE INTEGRATION END ---';

  const skillTreeInstruction = 
    `${markerStart}\n` +
    `• INTEGRAÇÃO OBRIGATÓRIA COM O SKILL TREE:\n` +
    `  No início de qualquer tarefa de codificação, refatoração, documentação ou auditoria no workspace atual,\n` +
    `  você DEVE verificar se a pasta '.skilltree' e o arquivo '.skilltree/active-tree.json' existem na raiz.\n` +
    `  Se existirem, você DEVE ler os arquivos correspondentes às habilidades ativas (em '.skilltree/tree/.../prompt.md')\n` +
    `  e aplicar rigorosamente as regras, arquiteturas e restrições descritas nesses documentos.\n` +
    `${markerEnd}`;

  // 1. Sincroniza com o Antigravity IDE (Gemini)
  const geminiDir = path.dirname(geminiRulesPath);
  if (fs.existsSync(geminiDir)) {
    try {
      let originalRules = '';
      if (fs.existsSync(geminiRulesPath)) {
        originalRules = fs.readFileSync(geminiRulesPath, 'utf8');
      }

      let newRules = '';
      const startIndex = originalRules.indexOf(markerStart);
      const endIndex = originalRules.indexOf(markerEnd);

      if (startIndex !== -1 && endIndex !== -1) {
        // Atualiza a seção existente
        let prefix = originalRules.substring(0, startIndex).replace(/\s+$/, '');
        newRules = (prefix ? prefix + '\n\n' : '') + skillTreeInstruction + originalRules.substring(endIndex + markerEnd.length);
      } else {
        // Adiciona ao final das regras existentes
        if (originalRules) {
          let prefix = originalRules.replace(/\s+$/, '');
          newRules = prefix + '\n\n' + skillTreeInstruction;
        } else {
          newRules = skillTreeInstruction;
        }
      }

      fs.writeFileSync(geminiRulesPath, newRules.trim() + '\n', 'utf8');
      console.log(`\n${GREEN}✔${RESET} Sincronização automática: Habilidade ativada no Antigravity IDE globalmente.`);
    } catch (err) {
      console.log(`\n${YELLOW}⚠${RESET} Não foi possível atualizar as regras globais do Antigravity IDE: ${err.message}`);
    }
  }

  // 2. Sincroniza com as configurações globais do VS Code, Cursor e Windsurf
  const appData = process.env.APPDATA;
  if (appData) {
    const vsCodeSettings = path.join(appData, 'Code', 'User', 'settings.json');
    const cursorSettings = path.join(appData, 'Cursor', 'User', 'settings.json');
    const windsurfSettings = path.join(appData, 'Windsurf', 'User', 'settings.json');

    updateGlobalSettingsJson(vsCodeSettings, 'VS Code / Copilot');
    updateGlobalSettingsJson(cursorSettings, 'Cursor');
    updateGlobalSettingsJson(windsurfSettings, 'Windsurf');
  }
}

/**
 * Atualiza o arquivo settings.json global de um editor de código injetando regras customizadas para as IAs.
 */
function updateGlobalSettingsJson(filePath, editorName) {
  if (!fs.existsSync(filePath)) return;
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let config = {};
    
    // Remove possíveis comentários de linha ou de bloco do settings.json para permitir JSON.parse
    const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    try {
      config = JSON.parse(cleanContent);
    } catch (e) {
      return; // Pula se o JSON global for inválido ou muito complexo para parsear de forma limpa
    }

    const targetInstruction = 
      "• INTEGRAÇÃO COM O SKILL TREE: No início de qualquer tarefa de desenvolvimento neste workspace, " +
      "verifique se a pasta '.skilltree' e o arquivo '.skilltree/active-tree.json' existem na raiz do projeto. " +
      "Se sim, leia os prompts correspondentes às habilidades ativas (localizados em '.skilltree/tree/.../prompt.md') " +
      "e siga rigorosamente as diretivas técnicas, de segurança e arquitetura descritas.";

    // Chaves de IA populares para injeção de instruções customizadas
    const keysToUpdate = [
      "github.copilot.chat.customInstructions",
      "chat.customInstructions",
      "google.gemini.customInstructions"
    ];

    let updated = false;
    for (const key of keysToUpdate) {
      let currentVal = config[key] || "";
      if (typeof currentVal === 'string') {
        if (!currentVal.includes("INTEGRAÇÃO COM O SKILL TREE")) {
          config[key] = (currentVal ? currentVal + "\n" : "") + targetInstruction;
          updated = true;
        }
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
      console.log(`${GREEN}✔${RESET} Sincronização automática: Habilidade ativada no ${editorName} globalmente.`);
    }
  } catch (err) {
    // Falha silenciosa para não quebrar a CLI principal
  }
}

function updateRuleFile(filePath, contentToInject) {
  let originalContent = '';
  if (fs.existsSync(filePath)) {
    originalContent = fs.readFileSync(filePath, 'utf8');
  }

  let newContent = '';
  const startIndex = originalContent.indexOf(MARKER_START);
  const endIndex = originalContent.indexOf(MARKER_END);

  if (startIndex !== -1 && endIndex !== -1) {
    let prefix = originalContent.substring(0, startIndex);
    prefix = prefix.replace(/\s+$/, ''); // Sanitiza espaços e quebras residuais no final do prefixo
    
    newContent =
      (prefix ? prefix + '\n\n' : '') +
      contentToInject +
      originalContent.substring(endIndex + MARKER_END.length);
  } else {
    // Adiciona ao final do arquivo preservando o que já existe de forma limpa
    if (originalContent) {
      let prefix = originalContent.replace(/\s+$/, '');
      newContent = prefix + '\n\n' + contentToInject;
    } else {
      newContent = contentToInject;
    }
  }

  const finalContent = newContent.trim() + '\n';
  fs.writeFileSync(filePath, finalContent, 'utf8');
}

// 5. Varredura do projeto para autodetectar tecnologias
function scanWorkspace() {
  printHeader(false);
  console.log(`${CYAN}${BOLD}[SCAN]${RESET} ${t('scanTitle')}\n`);

  const filesDetected = new Set();
  const depsDetected = new Set();

  // Escaneia arquivos na raiz do projeto hospedeiro (PROJECT_ROOT)
  try {
    const files = fs.readdirSync(PROJECT_ROOT);
    for (const file of files) {
      filesDetected.add(file);
    }
  } catch (e) { }

  // Escaneia package.json para dependências
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const dep of Object.keys(allDeps)) {
        depsDetected.add(dep);
      }
    } catch (e) { }
  }

  // Tenta encontrar outras pastas como k8s ou dockerfile em subdiretórios do projeto hospedeiro
  const searchFiles = ['Dockerfile', 'docker-compose.yml', 'schema.db', 'prisma.schema'];
  for (const f of searchFiles) {
    if (fs.existsSync(path.join(PROJECT_ROOT, f))) {
      filesDetected.add(f);
    }
  }

  const skills = loadAvailableSkills();
  const activeIds = loadActiveIds();
  const recommendations = [];

  for (const skill of skills) {
    let triggered = false;
    let triggerReason = '';

    // Verifica triggers de arquivo (usa correspondência simples)
    if (skill.triggers && skill.triggers.files) {
      for (const triggerFile of skill.triggers.files) {
        // Suporta wildcards básicos como *.sql
        if (triggerFile.startsWith('*.')) {
          const ext = triggerFile.slice(1);
          const hasFile = Array.from(filesDetected).some(f => f.endsWith(ext));
          if (hasFile) {
            triggered = true;
            triggerReason = t('scanReasonExtension', { ext });
            break;
          }
        } else if (filesDetected.has(triggerFile)) {
          triggered = true;
          triggerReason = t('scanReasonConfig', { file: triggerFile });
          break;
        }
      }
    }

    // Verifica triggers de dependência
    if (!triggered && skill.triggers && skill.triggers.dependencies) {
      for (const triggerDep of skill.triggers.dependencies) {
        if (depsDetected.has(triggerDep)) {
          triggered = true;
          triggerReason = t('scanReasonDependency', { dep: triggerDep });
          break;
        }
      }
    }

    if (triggered) {
      recommendations.push({
        skill,
        reason: triggerReason,
        active: activeIds.includes(skill.id)
      });
    }
  }

  if (recommendations.length === 0) {
    console.log(`${YELLOW}${t('noRecommendations')}${RESET}`);
  } else {
    console.log(`${BOLD}${CYAN}${t('recommendedSkills')}${RESET}\n`);
    for (const rec of recommendations) {
      const statusStr = rec.active ? `${GREEN}${t('activeLabel')}${RESET}` : `${RED}${t('inactiveLabel')}${RESET}`;
      console.log(` • ${BOLD}${rec.skill.name}${RESET} (${rec.skill.category}) - ${statusStr}`);
      console.log(`   ${GRAY}${t('reason')}${RESET} ${rec.reason}`);
      console.log(`   ${GRAY}${t('actionSuggested')}${RESET} ${t('runAddCommand', { id: rec.skill.id })}\n`);
    }
  }

  backToMenu();
}

// 6. Criar nova habilidade (Sem IA)
function createNewSkill() {
  printHeader(false);
  console.log(`${MAGENTA}${BOLD}[CREATE]${RESET} ${t('createTitle')}\n`);
  console.log(`${GRAY}${t('langTip1')}${RESET}`);
  console.log(`${GRAY}${t('langTip2')}${RESET}\n`);

  const rlLocal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rlLocal.question(`${BOLD}${t('namePrompt')}${RESET}`, (name) => {
    rlLocal.close(); // Fecha o readline de digitação de texto
    const skillName = name.trim();
    if (!skillName) {
      console.log(`${RED}${t('invalidName')}${RESET}`);
      return backToMenu();
    }

    // Passa para a seleção de categoria por setas
    chooseCategoryFlow(skillName);
  });
}

function chooseCategoryFlow(skillName) {
  const categories = ['backend', 'frontend', 'DevOps', 'security'];
  let localSelectedIndex = 0;

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  function renderCatMenu() {
    printHeader(false);
    console.log(`${MAGENTA}${BOLD}[CREATE]${RESET} ${t('createTitle')}\n`);
    console.log(`${BOLD}${t('namePrompt')}${RESET}${skillName}\n`);
    console.log(`${BOLD}${CYAN}${t('catPrompt')}${RESET}\n`);
    for (let i = 0; i < categories.length; i++) {
      const isSelected = i === localSelectedIndex;
      const cursor = isSelected ? `${BOLD}${MAGENTA}▶ ${RESET}` : '  ';
      const textStyle = isSelected ? `${BOLD}${CYAN}` : '';
      console.log(`${cursor}${textStyle}${categories[i]}${RESET}`);
    }
    console.log();
  }

  renderCatMenu();

  const handleCatKey = (str, key) => {
    if (!key) return;

    if (key.ctrl && key.name === 'c') {
      process.stdin.removeListener('keypress', handleCatKey);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.exit(0);
    }

    if (key.name === 'up') {
      localSelectedIndex = (localSelectedIndex - 1 + categories.length) % categories.length;
      renderCatMenu();
    } else if (key.name === 'down') {
      localSelectedIndex = (localSelectedIndex + 1) % categories.length;
      renderCatMenu();
    } else if (key.name === 'space' || key.name === 'return') {
      process.stdin.removeListener('keypress', handleCatKey);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }

      const cat = categories[localSelectedIndex];
      const id = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const skillDir = path.join(TREE_DIR, cat, id);

      if (fs.existsSync(skillDir)) {
        console.log(`${RED}${t('duplicateSkill', { id })}${RESET}`);
        return backToMenu();
      }

      fs.mkdirSync(skillDir, { recursive: true });

      const manifest = {
        id,
        name: skillName,
        category: cat,
        description: currentLang === 'pt' 
          ? `Habilidade personalizada criada via prompt do terminal.` 
          : `Custom skill created via terminal prompt.`,
        compatibility: {
          cursor: true,
          claude: true,
          antigravity: true
        },
        triggers: {
          files: [],
          dependencies: []
        }
      };

      const promptMd = currentLang === 'pt'
        ? `# Instruções do ${skillName}\n\nDescreva aqui as regras de prompt para o agente de IA quando esta habilidade estiver ativa.\n`
        : `# ${skillName} Instructions\n\nDescribe here the prompt rules for the AI agent when this skill is active.\n`;

      try {
        fs.writeFileSync(path.join(skillDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
        fs.writeFileSync(path.join(skillDir, 'prompt.md'), promptMd);
        console.log(`\n${GREEN}✔ ${t('skillCreated', { path: skillDir })}${RESET}`);
      } catch (err) {
        console.log(`${RED}Error writing skill: ${err.message}${RESET}`);
      }

      backToMenu();
    }
  };

  process.stdin.on('keypress', handleCatKey);
}

// 6b. Excluir habilidade física do catálogo
function deleteSkillFlow(skillId, isInteractive, callback) {
  const skills = loadAvailableSkills();
  const skill = skills.find(s => s.id === skillId);

  if (!skill) {
    const errorMsg = t('deleteErrNotExist', { id: skillId });
    if (isInteractive) {
      printHeader(false);
      console.log(`${RED}${errorMsg}${RESET}`);
      return backToMenu();
    } else {
      console.error(`${RED}${errorMsg}${RESET}`);
      process.exit(1);
    }
  }

  const promptText = t('deleteConfirm', { id: skillId });

  if (isInteractive) {
    printHeader(false);
    console.log(`${RED}${BOLD}[DELETE]${RESET} ${t('deleteConfirmTitle')}\n`);
    
    const rlLocal = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rlLocal.question(`${BOLD}${promptText}${RESET}`, (answer) => {
      rlLocal.close();
      const answerCleaned = answer.trim().toLowerCase();
      const confirmed = answerCleaned === 'y' || (currentLang === 'pt' && answerCleaned === 's');

      if (confirmed) {
        try {
          fs.rmSync(skill.dirPath, { recursive: true, force: true });
          
          const mdcPath = path.join(PROJECT_ROOT, '.cursor', 'rules', `${skillId}.mdc`);
          if (fs.existsSync(mdcPath)) {
            try {
              fs.unlinkSync(mdcPath);
            } catch (e) {}
          }
          
          let active = loadActiveIds();
          if (active.includes(skillId)) {
            active = active.filter(id => id !== skillId);
            saveActiveSkills(active);
          }
          console.log(`\n${GREEN}${t('deleteSuccess', { id: skillId })}${RESET}`);
        } catch (err) {
          console.log(`\n${RED}${t('deleteErr', { error: err.message })}${RESET}`);
        }
      } else {
        console.log(`\n${YELLOW}${t('deleteCancelled')}${RESET}`);
      }
      
      if (callback) {
        callback();
      } else {
        backToMenu();
      }
    });
  } else {
    // Modo não interativo (CLI direta)
    const rlLocal = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rlLocal.question(`${BOLD}${promptText}${RESET}`, (answer) => {
      rlLocal.close();
      const answerCleaned = answer.trim().toLowerCase();
      const confirmed = answerCleaned === 'y' || (currentLang === 'pt' && answerCleaned === 's');
      if (confirmed) {
        try {
          fs.rmSync(skill.dirPath, { recursive: true, force: true });

          const mdcPath = path.join(PROJECT_ROOT, '.cursor', 'rules', `${skillId}.mdc`);
          if (fs.existsSync(mdcPath)) {
            try {
              fs.unlinkSync(mdcPath);
            } catch (e) {}
          }

          let active = loadActiveIds();
          if (active.includes(skillId)) {
            active = active.filter(id => id !== skillId);
            saveActiveSkills(active);
          }
          console.log(`${GREEN}${t('deleteSuccess', { id: skillId })}${RESET}`);
          process.exit(0);
        } catch (err) {
          console.error(`${RED}${t('deleteErr', { error: err.message })}${RESET}`);
          process.exit(1);
        }
      } else {
        console.log(`${YELLOW}${t('deleteCancelled')}${RESET}`);
        process.exit(0);
      }
    });
  }
}

function backToMenu() {
  console.log(`\n${GRAY}${t('pressAnyKey')}${RESET}`);
  // Habilita temporariamente o raw mode para ler uma única tecla e voltar
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume(); // Garante que a entrada padrão está ativa para ler a tecla

  const tempHandler = (str, key) => {
    process.stdin.removeListener('keypress', tempHandler);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    runInteractiveMenu();
  };

  process.stdin.on('keypress', tempHandler);
}

let selectedRow = 0;
let selectedCol = 0;

// 7. Menu interativo principal (Baseado em teclado e setas de grade 2D)
function runInteractiveMenu() {
  const skills = loadAvailableSkills();
  const activeIds = loadActiveIds();

  // Agrupa as habilidades por categoria para renderização correta
  const categories = {};
  for (const skill of skills) {
    if (!categories[skill.category]) categories[skill.category] = [];
    categories[skill.category].push(skill);
  }

  const menuLines = [];
  const columnWidth = 46; // Largura segura para alinhar colunas horizontais
  const terminalCols = process.stdout.columns || 80;
  const numCols = Math.max(1, Math.floor(terminalCols / columnWidth));

  // Popula a grade de linhas e colunas com as habilidades agrupadas por categoria
  for (const catName of Object.keys(categories)) {
    const catSkills = categories[catName];
    for (let i = 0; i < catSkills.length; i += numCols) {
      const rowItems = [];
      for (let j = 0; j < numCols && (i + j) < catSkills.length; j++) {
        const skill = catSkills[i + j];
        rowItems.push({
          type: 'skill',
          id: skill.id,
          name: skill.name,
          category: catName,
          description: skill.description
        });
      }
      menuLines.push(rowItems);
    }
  }

  // Insere ações na parte inferior do menu como linhas individuais
  const actions = [
    { type: 'action', action: 'scan', label: t('actionScan') },
    { type: 'action', action: 'create', label: t('actionCreate') },
    { type: 'action', action: 'json', label: t('actionJson') },
    { type: 'action', action: 'lang', label: t('actionLang') },
    { type: 'action', action: 'exit', label: t('actionExit') }
  ];

  for (const act of actions) {
    menuLines.push([act]);
  }

  // Garante que o cursor de linha/coluna está sempre dentro dos limites após inicializar/reconstruir
  if (selectedRow >= menuLines.length) {
    selectedRow = 0;
  }
  if (selectedCol >= menuLines[selectedRow].length) {
    selectedCol = 0;
  }

  // Configura a leitura raw do teclado
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  function render() {
    printHeader(true);

    console.log(`${BOLD}${CYAN}${t('panelTitle')}${RESET}\n`);

    let currentCategory = '';

    for (let r = 0; r < menuLines.length; r++) {
      const rowItems = menuLines[r];
      
      // Exibe títulos de categoria para linhas de habilidades
      if (rowItems[0].type === 'skill') {
        const firstItem = rowItems[0];
        if (firstItem.category !== currentCategory) {
          currentCategory = firstItem.category;
          console.log(` ${BOLD}${MAGENTA}[${currentCategory.toUpperCase()}]${RESET}`);
        }
      } else {
        // Transição das habilidades para a categoria de ações
        if (r > 0 && menuLines[r - 1][0].type === 'skill') {
          console.log(`\n ${BOLD}${MAGENTA}[${t('actionsTitle')}]${RESET}`);
        }
      }

      let lineText = '';
      for (let c = 0; c < rowItems.length; c++) {
        const item = rowItems[c];
        const isSelected = (r === selectedRow && c === selectedCol);
        const cursor = isSelected ? `${BOLD}${MAGENTA}▶ ${RESET}` : '  ';
        const textStyle = isSelected ? `${BOLD}${CYAN}` : '';

        if (item.type === 'skill') {
          const isActive = activeIds.includes(item.id);
          const check = isActive ? `${GREEN}[✔]${RESET}` : `[ ]`;
          const cellContent = `${cursor}${check} ${textStyle}${item.name}${RESET}`;
          
          // Calcula comprimento sem cores ANSI para preencher o espaçamento de forma consistente
          const rawText = (isSelected ? '▶ ' : '  ') + (isActive ? '[✔] ' : '[ ] ') + item.name;
          const padLength = columnWidth - rawText.length;
          const padding = padLength > 0 ? ' '.repeat(padLength) : ' ';
          
          lineText += cellContent + padding;
        } else {
          // Ações simples
          lineText += `${cursor}${textStyle}${item.label}${RESET}`;
        }
      }
      console.log(lineText);

      // Exibe a descrição da habilidade selecionada na linha imediatamente inferior
      const selectedItem = menuLines[selectedRow][selectedCol];
      if (selectedItem.type === 'skill' && r === selectedRow) {
        console.log(`     ${GRAY}↳ ${selectedItem.description}${RESET}`);
      }
    }
    console.log();
  }

  // Primeira renderização
  render();

  const keypressHandler = (str, key) => {
    if (!key) return;

    if (key.ctrl && key.name === 'c') {
      cleanupAndExit();
    }

    if (key.name === 'up') {
      selectedRow = (selectedRow - 1 + menuLines.length) % menuLines.length;
      selectedCol = Math.min(selectedCol, menuLines[selectedRow].length - 1);
      render();
    } else if (key.name === 'down') {
      selectedRow = (selectedRow + 1) % menuLines.length;
      selectedCol = Math.min(selectedCol, menuLines[selectedRow].length - 1);
      render();
    } else if (key.name === 'left') {
      selectedCol = (selectedCol - 1 + menuLines[selectedRow].length) % menuLines[selectedRow].length;
      render();
    } else if (key.name === 'right') {
      selectedCol = (selectedCol + 1) % menuLines[selectedRow].length;
      render();
    } else if (key.name === 'space') {
      const currentItem = menuLines[selectedRow][selectedCol];
      if (currentItem.type === 'skill') {
        toggleSkill(currentItem.id);
      }
    } else if (key.name === 'd' || key.name === 'delete') {
      const currentItem = menuLines[selectedRow][selectedCol];
      if (currentItem.type === 'skill') {
        detachStdin();
        deleteSkillFlow(currentItem.id, true, () => {
          runInteractiveMenu();
        });
      }
    } else if (key.name === 'return') {
      const currentItem = menuLines[selectedRow][selectedCol];
      if (currentItem.type === 'skill') {
        toggleSkill(currentItem.id);
      } else if (currentItem.type === 'action') {
        detachStdin();
        executeAction(currentItem.action);
      }
    } else if (key.name === 'q') {
      cleanupAndExit();
    }
  };

  // Registra o handler de teclado
  process.stdin.on('keypress', keypressHandler);

  function toggleSkill(skillId) {
    let active = loadActiveIds();
    if (active.includes(skillId)) {
      active = active.filter(id => id !== skillId);
    } else {
      active.push(skillId);
    }
    saveActiveSkills(active);

    // Atualiza a lista local sem recarregar tudo
    activeIds.length = 0;
    activeIds.push(...active);
    render();
  }

  function detachStdin() {
    process.stdin.removeListener('keypress', keypressHandler);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }

  function cleanupAndExit() {
    detachStdin();
    console.log(`\n${CYAN}${t('thanks')}${RESET}\n`);
    process.exit(0);
  }

  function executeAction(actionName) {
    if (actionName === 'exit') {
      cleanupAndExit();
    } else if (actionName === 'scan') {
      scanWorkspace();
    } else if (actionName === 'create') {
      createNewSkill();
    } else if (actionName === 'lang') {
      changeLanguageFlow(() => {
        isFirstMenuPrint = true;
        runInteractiveMenu();
      });
    } else if (actionName === 'json') {
      printHeader(false);
      console.log(`${CYAN}${BOLD}[JSON STATE]${RESET} ${t('jsonStateTitle')}\n`);
      if (fs.existsSync(ACTIVE_JSON_PATH)) {
        console.log(fs.readFileSync(ACTIVE_JSON_PATH, 'utf8'));
      } else {
        console.log(`${RED}${t('jsonNotFound')}${RESET}`);
      }
      backToMenu();
    }
  }
}

// 8. Tratamento de argumentos CLI diretos
const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'menu';

function runCLI() {
  if (command === 'init') {
    initWorkspace();
  } else if (command === 'list') {
    const skills = loadAvailableSkills();
    const active = loadActiveIds();
    console.log(`${BOLD}${CYAN}${t('listTitle')}${RESET}`);
    skills.forEach(s => {
      const isAct = active.includes(s.id) ? `${GREEN}[${t('listActive')}]${RESET}` : `${RED}[${t('listInactive')}]${RESET}`;
      console.log(`- ${BOLD}${s.name}${RESET} (${s.id}) [${s.category}] - ${isAct}`);
    });
    process.exit(0);
  } else if (command === 'scan') {
    scanWorkspace();
  } else if (command === 'create') {
    createNewSkill();
  } else if (command === 'add') {
    const skillId = args[1];
    if (!skillId) {
      console.log(`${RED}${t('addErrId')}${RESET}`);
      process.exit(1);
    }
    const skills = loadAvailableSkills();
    if (!skills.some(s => s.id === skillId)) {
      console.log(`${RED}${t('addErrNotExist', { id: skillId })}${RESET}`);
      process.exit(1);
    }
    let active = loadActiveIds();
    if (!active.includes(skillId)) {
      active.push(skillId);
      saveActiveSkills(active);
      console.log(`${GREEN}${t('addSuccess', { id: skillId })}${RESET}`);
    } else {
      console.log(`${YELLOW}${t('addAlreadyActive', { id: skillId })}${RESET}`);
    }
    process.exit(0);
  } else if (command === 'remove') {
    const skillId = args[1];
    if (!skillId) {
      console.log(`${RED}${t('removeErrId')}${RESET}`);
      process.exit(1);
    }
    let active = loadActiveIds();
    if (active.includes(skillId)) {
      active = active.filter(id => id !== skillId);
      saveActiveSkills(active);
      console.log(`${GREEN}${t('removeSuccess', { id: skillId })}${RESET}`);
    } else {
      console.log(`${YELLOW}${t('removeAlreadyInactive', { id: skillId })}${RESET}`);
    }
    process.exit(0);
  } else if (command === 'delete') {
    const skillId = args[1];
    if (!skillId) {
      console.log(`${RED}${t('deleteErrId')}${RESET}`);
      process.exit(1);
    }
    deleteSkillFlow(skillId, false);
  } else {
    // Executa menu interativo por padrão
    runInteractiveMenu();
  }
}

// Inicializa a execução avaliando o idioma padrão
checkLanguageAndRun(runCLI);
