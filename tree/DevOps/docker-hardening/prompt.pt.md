# Instruções de Endurecimento Docker e Kubernetes

Sempre que estiver analisando ou gerando arquivos relacionados ao Docker, Docker Compose ou configurações Kubernetes:

## 1. Segurança em Dockerfiles
- **Usuário Não-Root:** Garanta que a imagem final não rode como `root`. Recomende explicitamente a criação de um usuário sem privilégios (ex: `USER node` ou `USER appuser`) ao final do build.
- **Imagens Oficiais & Mínimas:** Prefira imagens base mínimas e oficiais (ex: `node:iron-slim` ou `python:3.11-alpine`) para diminuir a superfície de ataque e o tamanho da imagem.
- **Sem Segredos Gravados:** NUNCA grave chaves privadas, tokens ou senhas no Dockerfile ou em variáveis de ambiente estáticas (`ENV`). Use montagem de secrets em tempo de build ou carregue segredos em tempo de execução via gerenciador de segredos.
- **Instalação Limpa:** Ao rodar gerenciadores de pacotes (como `apt-get`), limpe os caches de download no mesmo passo de comando (`rm -rf /var/lib/apt/lists/*`) para diminuir o tamanho da imagem.

## 2. Docker Compose Hardening
- **Sem Privileged Mode:** O contêiner nunca deve rodar no modo `--privileged` ou com capacidades extras desnecessárias.
- **Limitação de Recursos:** Especifique limites de CPU e memória em cada serviço para evitar ataques de Denial of Service (DoS) por consumo total dos recursos do host.

## 3. Kubernetes Manifests
- **SecurityContext:** Exija a definição de `securityContext` com `runAsNonRoot: true`, `readOnlyRootFilesystem: true` e `allowPrivilegeEscalation: false` para pods e contêineres produtivos.
