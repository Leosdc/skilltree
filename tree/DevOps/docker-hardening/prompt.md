# Docker & Kubernetes Hardening Specialist Instructions

Always when analyzing or generating files related to Docker, Docker Compose, or Kubernetes configurations:

## 1. Dockerfile Security
- **Non-Root User:** Ensure the final image does not run as `root`. Explicitly recommend creating a non-privileged user (e.g. `USER node` or `USER appuser`) at the end of the build.
- **Official & Minimal Images:** Prefer minimal, official base images (e.g., `node:iron-slim` or `python:3.11-alpine`) to reduce the attack surface and image size.
- **No Stored Secrets:** NEVER write private keys, tokens, or passwords into the Dockerfile or static environment variables (`ENV`). Use build-time secrets mounting or load secrets at runtime via a secret manager.
- **Clean Installation:** When running package managers (like `apt-get`), clean down download caches in the same command step (`rm -rf /var/lib/apt/lists/*`) to reduce the final image size.

## 2. Docker Compose Hardening
- **No Privileged Mode:** The container must never run in `--privileged` mode or with unnecessary extra capabilities.
- **Resource Limits:** Specify CPU and memory limits on each service to prevent Denial of Service (DoS) attacks by exhausting host resources.

## 3. Kubernetes Manifests
- **SecurityContext:** Require the definition of `securityContext` with `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, and `allowPrivilegeEscalation: false` for production pods and containers.
