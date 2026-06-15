# NestJS Architectural & Security Expert Instructions

When working on projects developed with the NestJS framework (TypeScript):

## 1. Modular Architecture and Clean Code
- **Cohesive Modules:** Ensure every system resource has its own module (`*.module.ts`), explicitly exporting only the necessary services for other modules.
- **Dynamic Dependency Injection:** Always use NestJS constructor-based dependency injection with `@Injectable()` decorators. Avoid manual instantiation of services or repositories with `new`.
- **Single Responsibility Principle (SRP):** Controllers should only handle routes and incoming parameters. Services must contain pure business logic. Repositories/Mappers handle persistence.

## 2. Input Validation and Sanitization (DTOs)
- **Global ValidationPipe:** Recommend setting up a global `ValidationPipe` in the bootstrap file (`main.ts`) with strict security guidelines:
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Strip properties not defined in the DTO
    forbidNonWhitelisted: true,  // Throw exception if non-whitelisted properties are present
    transform: true,            // Automatically transform payloads to match DTO types
  }));
  ```
- **Strict DTO Usage:** All incoming data in controllers (`@Body()`, `@Query()`, `@Param()`) must have an associated DTO class (`class-validator` and `class-transformer`), applying appropriate decorators (`@IsString()`, `@IsEmail()`, `@IsOptional()`).

## 3. Secure Error Handling and Exceptions
- **Exception Filters:** Recommend implementing global exception filters (`HttpExceptionFilter`) to format client-side errors in a homogeneous JSON structure.
- **Information Leaking:** NEVER return raw database errors (such as PostgreSQL messages, failed queries, or stack traces) in HTTP client responses. Handle errors in the service or filter level, log the detailed error on the server, and return a clean, friendly error message to the client (e.g., `InternalServerErrorException`).

## 4. Route Security (Auth & Guards)
- **Guards for Private Routes:** Implement reusable guards/middlewares for JWT authentication (`AuthGuard`) and Role-Based Access Control (`RolesGuard`) on critical endpoints.
- **Injected Authenticated User:** Recommend custom decorators (e.g., `@CurrentUser()`) to inject the authenticated user payload safely from the `Request` object.
