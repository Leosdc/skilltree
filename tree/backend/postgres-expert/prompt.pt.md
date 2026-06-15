# Instruções de Otimização PostgreSQL

Quando estiver trabalhando com consultas SQL, esquemas de tabelas ou migrações em PostgreSQL:

## 1. Otimização de Consultas & Indexação
- **EXPLAIN ANALYZE:** Sempre recomende o uso de `EXPLAIN (ANALYZE, BUFFERS)` para analisar o plano de execução físico de consultas lentas.
- **Índices Parciais:** Se uma coluna for muito filtrada com base em valores específicos (ex: `status = 'active'`), use índices parciais para reduzir o espaço em disco.
- **Índices de Cobertura (Covering Indexes):** Utilize a cláusula `INCLUDE` para adicionar colunas extras ao índice, permitindo varreduras exclusivas por índice (Index-Only Scan).
- **Evitar N+1:** Recomende joins explícitos ou carregamento em lotes em vez de requisições repetidas ao banco dentro de loops na aplicação.

## 2. Modelagem & Integridade
- **Tipos de Dados:** Prefira `uuid` nativo a inteiros sequenciais para chaves primárias expostas externamente. Use `jsonb` em vez de `json` para documentos dinâmicos.
- **Restrições:** Sempre exija restrições de integridade no banco (ex: `FOREIGN KEY`, `NOT NULL`, `CHECK`), reduzindo a dependência de validação puramente em nível de aplicação.

## 3. Segurança Contra Injeção SQL
- **Prepared Statements / Queries Parametrizadas:** NUNCA concatene valores diretamente nas queries de texto. Use placeholders (`$1`, `$2`) fornecidos pelo driver.
- **Princípio do Menor Privilégio:** Limite as permissões da conta de conexão da aplicação para apenas as tabelas e ações estritamente necessárias.
