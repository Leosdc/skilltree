# Instruções de Arquitetura e Segurança em NestJS

Quando estiver trabalhando em projetos desenvolvidos com o framework NestJS (TypeScript):

## 1. Arquitetura Modular e Clean Code
- **Módulos Coesos:** Garanta que cada recurso do sistema tenha o seu próprio módulo (`*.module.ts`), exportando explicitamente apenas os serviços necessários para outros módulos.
- **Injeção de Dependências Dinâmica:** Sempre utilize a injeção de dependências do NestJS via construtores de classe com decorators `@Injectable()`. Evite instanciar classes manualmente com `new` para serviços ou repositórios.
- **Divisão de Responsabilidades (SRP):** Controllers devem apenas gerenciar rotas e receber parâmetros. Services devem conter a lógica de negócios pura. Repositories/Mapeadores cuidam da persistência.

## 2. Validação e Sanitização de Entradas (DTOs)
- **ValidationPipe Global:** Recomende a configuração de um `ValidationPipe` global no arquivo de boot (`main.ts`) com as diretrizes de segurança estritas:
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Remove propriedades extras que não estão no DTO
    forbidNonWhitelisted: true,  // Lança exceção se houver parâmetros não permitidos
    transform: true,            // Tipa e converte os valores automaticamente nos DTOs
  }));
  ```
- **Uso Estrito de DTOs:** Toda entrada de dados em controllers (`@Body()`, `@Query()`, `@Param()`) deve possuir uma classe DTO associada (`class-validator` e `class-transformer`), aplicando decorators apropriados (`@IsString()`, `@IsEmail()`, `@IsOptional()`).

## 3. Tratamento Seguro de Erros e Exceções
- **Exception Filters:** Recomende a implementação de filtros globais de exceções (`HttpExceptionFilter`) para formatar respostas de erro do cliente em um padrão JSON homogêneo.
- **Vazamento de Detalhes:** NUNCA retorne o erro cru do banco de dados (como mensagens de erro do PostgreSQL, queries sql que falharam, ou stack traces) na resposta HTTP do cliente. Trate o erro no service/filtro, registre o erro detalhado nos logs do servidor e envie uma mensagem genérica amigável ao cliente (ex: `InternalServerErrorException`).

## 4. Segurança de Rotas (Auth & Guards)
- **Guards para Rotas Protegidas:** Implemente middlewares/guards reutilizáveis para autenticação JWT (`AuthGuard`) e controle de acesso baseado em papéis (`RolesGuard`) no topo de rotas críticas.
- **Injeção de Usuário Conectado:** Recomende decorators customizados (ex: `@CurrentUser()`) para injetar com segurança o payload do usuário autenticado a partir do objeto `Request`.
