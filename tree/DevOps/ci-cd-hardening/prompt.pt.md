# Instruções de Segurança e Endurecimento em CI/CD

Quando estiver escrevendo, editando ou auditando workflows de CI/CD (GitHub Actions, GitLab CI, Google Cloud Build, etc.):

## 1. Segurança de Dependências e Ações (Supply Chain)
- **Pinagem por SHA de Commit:** NUNCA utilize tags mutáveis de versão (ex: `uses: actions/checkout@v4` ou `uses: actions/checkout@main`). Em vez disso, exija sempre a pinagem por hash de commit SHA-1 completo (ex: `uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.1.0`).
- **Comentários de Versão:** Mantenha um comentário explicativo ao lado do SHA de commit para indicar qual versão semântica aquela tag aponta, facilitando auditorias e atualizações futuras.
- **Ações de Terceiros:** Desconfie de ações de criadores não verificados no GitHub Marketplace. Sempre recomende preferencialmente ações oficiais (`actions/`, `github/`, marcas reconhecidas) ou audite o código da ação de terceiros antes de adicioná-la.

## 2. Princípio do Menor Privilégio (GITHUB_TOKEN Permissions)
- **Escopo Explícito:** Declare explicitamente as permissões do `GITHUB_TOKEN` no nível do workflow ou do job usando a chave `permissions:`. Nunca assuma as permissões de leitura/escrita padrão herdadas da organização.
- **Configuração Segura Padrão:** O padrão deve ser somente leitura:
  ```yaml
  permissions:
    contents: read
  ```
- **Jobs Individuais:** Ajuste fino de permissões para jobs específicos (ex: para deploy em GitHub Pages, use `pages: write` e `id-token: write` apenas no job de deployment).

## 3. Prevenção de Injeção de Scripts (Script Injection)
- **Sanitização de Contexto:** NUNCA concatene valores dinâmicos de contexto do GitHub que possam ser controlados por usuários externos diretamente em scripts inline (como `run: echo "${{ github.event.head_commit.message }}"`). Isso expõe o runner a injeção arbitrária de comandos bash.
- **Variáveis de Ambiente Dinâmicas:** Para tratar dados dinâmicos do contexto do GitHub em scripts `run:`, passe-os como variáveis de ambiente intermediárias:
  ```yaml
  # INCORRETO
  run: echo "PR Title: ${{ github.event.pull_request.title }}"
  
  # CORRETO
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: echo "PR Title: $PR_TITLE"
  ```

## 4. Gestão Segura de Segredos (Secrets Management)
- **Segredos nos Logs:** Nunca ecoe segredos em texto puro (`echo $SECRET`). Embora o GitHub mascare valores ocultos, a injeção em arquivos de log complexos (ex: dumps de JSON) ou a codificação em Base64 pode burlar o filtro do GitHub.
- **Menor Escopo de Variáveis:** Passe variáveis de segredo apenas para as etapas que as utilizam de fato, usando `env:` local na etapa, em vez de declará-las no escopo do job inteiro.
- **Provedores de OIDC:** Dê preferência a autenticação OIDC (OpenID Connect) em provedores de nuvem (AWS, GCP, Azure) para evitar persistir senhas e chaves de acesso estáticas de longa duração nos segredos do repositório.
