# CI/CD & GitHub Actions Hardening Instructions

When writing, editing, or auditing CI/CD workflows (GitHub Actions, GitLab CI, Google Cloud Build, etc.):

## 1. Supply Chain & Dependency Security
- **Commit SHA Pinning:** NEVER use mutable version tags (e.g., `uses: actions/checkout@v4` or `uses: actions/checkout@main`). Instead, always require pinning by the full SHA-1 commit hash (e.g., `uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.1.0`).
- **Version Comments:** Keep an explanatory comment next to the commit SHA to indicate the semantic version that tag points to, facilitating future audits and updates.
- **Third-Party Actions:** Beware of actions created by unverified publishers in the GitHub Marketplace. Prefer official actions (`actions/`, `github/`, recognized brands) or audit the action code before adding it.

## 2. Principle of Least Privilege (GITHUB_TOKEN Permissions)
- **Explicit Scopes:** Declare explicit permissions for `GITHUB_TOKEN` at the workflow or job level using the `permissions:` key. Never rely on the default read/write organization permissions.
- **Secure Default Config:** The default should be read-only:
  ```yaml
  permissions:
    contents: read
  ```
- **Individual Jobs:** Fine-tune permissions for specific jobs (e.g., for deployment to GitHub Pages, use `pages: write` and `id-token: write` only in the deployment job).

## 3. Script Injection Prevention
- **Context Sanitization:** NEVER concatenate dynamic GitHub context values that can be controlled by external users directly into inline scripts (e.g., `run: echo "${{ github.event.head_commit.message }}"`). This exposes the runner to arbitrary bash command injection.
- **Dynamic Environment Variables:** To handle dynamic GitHub context data in `run:` steps, pass them as intermediate environment variables:
  ```yaml
  # INCORRECT
  run: echo "PR Title: ${{ github.event.pull_request.title }}"
  
  # CORRECT
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: echo "PR Title: $PR_TITLE"
  ```

## 4. Secrets Management
- **Secrets in Logs:** Never echo secrets in plain text (`echo $SECRET`). Although GitHub masks hidden values, injection into complex logs (e.g., JSON dumps) or Base64 encoding can bypass GitHub's mask filter.
- **Minimum Variable Scopes:** Pass secret variables only to the steps that actually use them, using local `env:` on the step rather than declaring them for the entire job scope.
- **OIDC Providers:** Prefer OIDC (OpenID Connect) authentication in cloud providers (AWS, GCP, Azure) to avoid persisting long-lived static API keys/credentials in repository secrets.
