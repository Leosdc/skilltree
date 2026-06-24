# Spec para Repo

Transforme uma especificação de projeto em linguagem natural em um repositório starter completo e executável. Não é um preenchedor de template — é um interpretador de spec que gera código real e funcional para qualquer stack.

## Quando Usar

- Usuário fornece uma descrição de texto de um app e quer código
- Usuário tem um PRD, documento de requisitos ou lista de funcionalidades e precisa de uma base de código
- Usuário diz "crie um app que...", "scaffolde isso", "faça bootstrap de um projeto"
- Usuário quer um repo starter funcional, não apenas uma árvore de arquivos

**Não é esta skill** quando o usuário quer um app SaaS com Stripe + Auth especificamente — use `product-team/saas-scaffolder` em vez disso.

## Fluxo de Trabalho Principal

### Fase 1: — Analisar e Interpretar

Leia a spec. Extraia estes campos silenciosamente:

| Campo | Fonte | Obrigatório |
|-------|-------|-------------|
| Nome do app | Explícito ou inferido da descrição | sim |
| Descrição | Primeira frase da spec | sim |
| Funcionalidades | Bullet points ou frases descrevendo comportamento | sim |
| Stack tecnológica | Explícita ("use FastAPI") ou inferida do contexto | sim |
| Auth | "login", "usuários", "contas", "papéis" | se mencionado |
| Banco de dados | "armazenar", "salvar", "persistir", "registros", "schema" | se mencionado |
| Superfície de API | "endpoint", "API", "REST", "GraphQL" | se mencionado |
| Alvo de implantação | "Vercel", "Docker", "AWS", "Railway" | se mencionado |

**Regras de inferência de stack** (quando o usuário não especifica):

| Sinal | Stack inferida |
|-------|---------------|
| "web app", "dashboard", "SaaS" | Next.js + TypeScript |
| "API", "backend", "microservice" | FastAPI (Python) ou Express (Node) |
| "app mobile" | Flutter ou React Native |
| "ferramenta CLI" | Go ou Python |
| "pipeline de dados" | Python |
| "alto desempenho", "sistemas" | Rust ou Go |

Após fazer o parsing, apresente uma interpretação estruturada de volta ao usuário:

```
## Interpretação da Spec

**App:** [nome]
**Stack:** [framework + linguagem]
**Funcionalidades:**
1. [funcionalidade]
2. [funcionalidade]

**Banco de dados:** [sim/não — engine]
**Auth:** [sim/não — método]
**Deploy:** [alvo]

Isso corresponde à sua intenção? Alguma correção antes de gerar?
```

Sinalize ambiguidades. Faça **no máximo 3** perguntas de esclarecimento. Se o usuário disser "só construa", prossiga com os melhores padrões.

### Fase 2: — Arquitetura

Projete o projeto antes de escrever qualquer arquivo:

1. **Selecionar template** — Corresponda a um template de stack de `references/stack-templates.md`
2. **Definir árvore de arquivos** — Liste cada arquivo que será criado
3. **Mapear funcionalidades para arquivos** — Cada funcionalidade recebe pelo menos um arquivo/componente
4. **Projetar schema do banco de dados** — Se aplicável, defina tabelas/coleções com campos e tipos
5. **Identificar dependências** — Liste cada pacote com restrições de versão
6. **Planejar rotas de API** — Se aplicável, liste cada endpoint com método, caminho, shape de request/response

Apresente a árvore de arquivos ao usuário antes de gerar:

```
project-name/
├── README.md
├── .env.example
├── .gitignore
├── .github/workflows/ci.yml
├── package.json / requirements.txt / go.mod
├── src/
│   ├── ...
├── tests/
│   ├── ...
└── ...
```

### Fase 3: — Gerar

Escreva cada arquivo. Regras:

- **Código real, não stubs.** Cada função tem uma implementação real. Sem `// TODO: implementar` ou placeholders `pass`.
- **Sintaticamente válido.** Cada arquivo deve parsear sem erros em sua linguagem.
- **Imports correspondem às dependências.** Cada import deve corresponder a um pacote no manifesto (package.json, requirements.txt, go.mod, etc.).
- **Tipos incluídos.** Projetos TypeScript usam tipos. Projetos Python usam type hints. Projetos Go usam structs tipados.
- **Variáveis de ambiente.** Gere `.env.example` com cada variável necessária, comentada com propósito.
- **README.md.** Inclua: descrição do projeto, pré-requisitos, etapas de configuração (clone, install, configurar env, executar) e scripts/comandos disponíveis.
- **Config CI.** Gere `.github/workflows/ci.yml` com: install, lint (se linter nas deps), test, build.
- **.gitignore.** Ignores apropriados para a stack (node_modules, __pycache__, .env, artefatos de build).

**Ordem de geração de arquivos:**
1. Manifesto (package.json / requirements.txt / go.mod)
2. Arquivos de config (.env.example, .gitignore, CI)
3. Schema do banco de dados / migrations
4. Lógica de negócio principal
5. Rotas de API / endpoints
6. Componentes de UI (se aplicável)
7. Testes
8. README.md

### Fase 4: — Validar

Após a geração, passe por esta lista de verificação:

- [ ] Cada pacote importado existe no manifesto
- [ ] Cada arquivo referenciado por um import existe na árvore
- [ ] `.env.example` lista cada variável de env usada no código
- [ ] `.gitignore` cobre artefatos de build e segredos
- [ ] README tem instruções de configuração que realmente funcionam
- [ ] Sem segredos, chaves de API ou senhas hardcoded
- [ ] Pelo menos um arquivo de teste existe
- [ ] O comando build/start está documentado e funcionaria

Execute `scripts/validate_project.py` contra o diretório gerado para detectar problemas comuns.

## Exemplos

### Exemplo 1: API de Gerenciamento de Tarefas

**Spec de entrada:**
> "Construa uma API de gerenciamento de tarefas. Usuários podem criar, listar, atualizar e excluir tarefas. Tarefas têm título, descrição, status (todo/em-progresso/concluído) e data de vencimento. Use FastAPI com SQLite. Adicione auth básica com chaves de API."

**Árvore de arquivos de saída:**
```
task-api/
├── README.md
├── .env.example              # API_KEY, DATABASE_URL
├── .gitignore
├── .github/workflows/ci.yml
├── requirements.txt          # fastapi, uvicorn, sqlalchemy, pytest
├── main.py                   # app FastAPI, CORS, lifespan
├── models.py                 # modelo SQLAlchemy Task
├── schemas.py                # schemas Pydantic request/response
├── database.py               # engine SQLite + sessão
├── auth.py                   # middleware de chave de API
├── routers/
│   └── tasks.py              # endpoints CRUD
└── tests/
    └── test_tasks.py         # testes de smoke para cada endpoint
```

### Exemplo 2: App Web de Compartilhamento de Receitas

**Spec de entrada:**
> "Quero um website de compartilhamento de receitas. Usuários se cadastram, postam receitas com ingredientes e etapas, navegam por outras receitas e salvam favoritos. Use Next.js com Tailwind. Armazene dados em PostgreSQL."

**Árvore de arquivos de saída:**
```
recipe-share/
├── README.md
├── .env.example              # DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
├── .gitignore
├── .github/workflows/ci.yml
├── package.json              # next, react, tailwindcss, prisma, next-auth
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── prisma/
│   └── schema.prisma         # modelos User, Recipe, Ingredient, Favorite
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Homepage — feed de receitas
│   │   ├── recipes/
│   │   │   ├── page.tsx      # Navegar por receitas
│   │   │   ├── [id]/page.tsx # Detalhe da receita
│   │   │   └── new/page.tsx  # Formulário de criação de receita
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── recipes/route.ts
│   ├── components/
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeForm.tsx
│   │   └── Navbar.tsx
│   └── lib/
│       ├── prisma.ts
│       └── auth.ts
└── tests/
    └── recipes.test.ts
```

### Exemplo 3: Rastreador de Despesas CLI

**Spec de entrada:**
> "Ferramenta CLI Python para rastrear despesas. Comandos: add, list, summary, export-csv. Armazene em um arquivo SQLite local. Sem API externa."

**Árvore de arquivos de saída:**
```
expense-tracker/
├── README.md
├── .gitignore
├── .github/workflows/ci.yml
├── pyproject.toml
├── src/
│   └── expense_tracker/
│       ├── __init__.py
│       ├── cli.py            # comandos argparse
│       ├── database.py       # operações SQLite
│       ├── models.py         # dataclass Expense
│       └── formatters.py     # saída em tabela + CSV
└── tests/
    └── test_cli.py
```

## Antipadrões

| Antipadrão | Correção |
|------------|----------|
| **Código placeholder** — `// TODO: implementar`, `pass`, corpos de função vazios | Cada função tem uma implementação real. Se complexo, implemente uma versão simplificada funcional. |
| **Override de stack** — escolher Next.js quando o usuário disse Flask | Sempre respeite preferências tecnológicas explícitas. Infira apenas quando o usuário não especifica. |
| **Falta de .gitignore** — fazer commit de node_modules ou .env | Gere .gitignore apropriado para a stack como um dos primeiros arquivos. |
| **Imports fantasmas** — importar pacotes não listados no manifesto | Verifique cada import no package.json / requirements.txt antes de terminar. |
| **Over-engineering do MVP** — adicionar cache Redis, limitação de taxa, WebSockets a um v1 | Construa o mínimo que funciona. O usuário pode iterar. |
| **Ignorar preferências declaradas** — usuário diz "PostgreSQL" e você gera MongoDB | Analise a spec cuidadosamente. Preferências explícitas são inegociáveis. |
| **Variáveis de env ausentes** — código lê `process.env.X` mas `.env.example` não lista | Cada variável de env usada no código deve aparecer em `.env.example` com um comentário. |
| **Sem testes** — entregar um repo com zero arquivos de teste | No mínimo: um teste de smoke por endpoint de API ou um teste por função principal. |
| **APIs alucinadas** — gerar código que chama métodos de biblioteca que não existem | Siga APIs bem documentadas e estáveis. Quando incerto, use a abordagem mais simples. |

## Script de Validação

### `scripts/validate_project.py`

Verifica um diretório de projeto gerado em busca de problemas comuns:

```bash
# Validar um projeto gerado
python3 scripts/validate_project.py /path/to/generated-project

# Saída JSON
python3 scripts/validate_project.py /path/to/generated-project --format json
```

Verificações realizadas:
- README.md existe e não está vazio
- .gitignore existe
- .env.example existe (se o código referencia variáveis de env)
- Manifesto de pacotes existe (package.json, requirements.txt, go.mod, Cargo.toml, pubspec.yaml)
- Sem arquivo .env committed (vazamento de segredos)
- Pelo menos um arquivo de teste existe
- Sem placeholders TODO/FIXME no código gerado

## Aprimoramento Progressivo

Para specs complexas, gere em etapas:

1. **MVP** — Funcionalidade principal apenas, funcionando de ponta a ponta
2. **Auth** — Adicionar autenticação se solicitado
3. **Polimento** — Tratamento de erros, validação, estados de carregamento
4. **Deploy** — Docker, CI, config de deploy

Pergunte ao usuário após o MVP: "O núcleo está funcionando. Quer que eu adicione auth/polimento/deploy a seguir, ou itere no que está aqui?"

## Referências Cruzadas

- Relacionado: `product-team/saas-scaffolder` — Scaffolding específico para SaaS (Next.js + Stripe + Auth)
- Relacionado: `engineering/spec-driven-workflow` — Metodologia de desenvolvimento spec-first
- Relacionado: `engineering/database-designer` — Padrões de design de schema de banco de dados
- Relacionado: `engineering-team/senior-fullstack` — Padrões de implementação full-stack