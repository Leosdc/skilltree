# Instruções de Segurança e Otimização em Python

Quando estiver trabalhando em arquivos ou projetos desenvolvidos em Python:

## 1. Segurança Contra Injeção SQL & Injeção de Comandos
- **Consultas Parametrizadas:** NUNCA monte queries SQL utilizando interpolação de strings (`f"SELECT * FROM users WHERE id = {user_id}"`) ou concatenação. Utilize sempre placeholders/queries parametrizadas fornecidos pela biblioteca/ORM (ex: `cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))`).
- **Execução Insegura de Processos:** Evite usar `os.system()` ou a chamada `subprocess` com a flag `shell=True`. Isso permite a injeção arbitrária de comandos em nível de SO. Utilize sempre listas de argumentos separadas com o shell desligado:
  ```python
  # INCORRETO
  subprocess.run(f"ls -la {user_input}", shell=True)
  
  # CORRETO
  subprocess.run(["ls", "-la", user_input])
  ```
- **Deserialização Segura:** NUNCA deserialize dados vindos do cliente usando o módulo `pickle` padrão. Prefira formatos de serialização seguros como JSON ou Protocol Buffers.

## 2. Otimização de Recursos e Gestão de Memória
- **Uso Estrito de Generators:** Ao processar grandes conjuntos de dados ou arquivos pesados, prefira funções geradoras (`yield`) em vez de carregar listas inteiras na memória RAM.
- **Gerenciamento de Contexto (Context Managers):** Utilize sempre a palavra-chave `with` para abrir arquivos, conexões de banco de dados ou sockets. Isso garante o fechamento correto do descritor de recursos do SO mesmo em caso de exceções:
  ```python
  with open("dados.txt", "r") as file:
      for line in file:
          process(line)
  ```

## 3. Segurança de APIs e Frameworks (Django, Flask, FastAPI)
- **FastAPI / Pydantic:** Exija o uso de DTOs (`BaseModel`) do Pydantic em rotas de FastAPI para validação automática de tipos, prevenindo manipulações inesperadas de dados.
- **Django Debug Mode:** Certifique-se de que a configuração `DEBUG = False` está definida em ambiente de produção para evitar o vazamento de stack traces informativos e variáveis de ambiente em páginas públicas de erro.
- **Flask Secret Key:** Garanta que segredos como a `SECRET_KEY` do Flask sejam lidos das variáveis de ambiente (`os.getenv`), nunca fixados no código.
