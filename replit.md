# Loor Investor App

## Overview
This is the Loor Investor mobile application built with React Native and Expo. It runs as a web app in the Replit environment using Expo's Metro bundler for web.

## Tech Stack
- **Framework**: React Native 0.79.5 + Expo 53
- **Language**: TypeScript
- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation (native-stack + bottom-tabs)
- **HTTP Client**: Axios
- **Data Fetching**: TanStack React Query
- **UI**: React Native Paper
- **Animations**: Lottie React Native

## Development Setup

### Environment Variables
The development environment is configured via Replit secrets:
- `ENV`: Set to `DEV` for development
- `API_BASE_URL`: `https://backend-homolog-debt.onrender.com` (development backend)
- `BASIC_AUTH`: Basic authentication token for public endpoints
- `PUBLIC_SCOPES_AUTH`: Comma-separated list of scopes
- `PUBLIC_GRANT_TYPE_AUTH`: Authentication grant type (client_credentials)
- `BASE_URL_VIACEP`: ViaCEP API endpoint for address lookup
- `APP_STORE_URL`, `PLAY_STORE_URL`: App store links
- `EXPO_APPLE_TEAM_ID`: Apple team ID (optional for local development)

### Running in Replit
The app runs on port 5000:
```bash
npm run web:replit
```

## Git Workflow — Develop → Main

O projeto usa um fluxo de duas branches para separar homologação de produção:

```
Replit (main local)
       │
       ▼  git push
origin/develop  ──── homologação / QA
       │
       ▼  Pull Request aprovado
origin/main  ──── produção
```

### Como funciona

- **Todo trabalho no Replit** é commitado na branch local `main`.
- **Ao fazer push**, o código vai automaticamente para `origin/develop` no GitHub (configurado via `branch.main.merge`).
- **Para promover para produção**, abra um Pull Request de `develop` → `main` no GitHub (manualmente ou via GitHub Actions abaixo).

### Promover develop → main (GitHub Actions)

1. Acesse o repositório no GitHub: `https://github.com/devLoor1/FRONT-APP`
2. Vá em **Actions** → **"Promover develop para main"**
3. Clique em **"Run workflow"**
4. Preencha o título do PR (opcional) e clique em **"Run workflow"**
5. Um Pull Request será criado automaticamente de `develop` → `main`
6. Revise e faça o merge do PR para publicar em produção

### Configuração inicial — Push para develop

Para habilitar o push automático para `origin/develop`, é necessário autenticar com o GitHub. Adicione um Personal Access Token (PAT) com escopo `repo` como secret no Replit:

1. Crie um PAT em: `https://github.com/settings/tokens` (escopo: `repo`)
2. No Replit, adicione como secret: `GITHUB_PAT`
3. Configure a URL autenticada:
   ```bash
   git remote set-url origin https://<SEU_PAT>@github.com/devLoor1/FRONT-APP.git
   git push origin main:develop
   ```

### Proteger a branch main no GitHub (recomendado)

Para evitar push direto para `main` sem PR:
1. Acesse: `github.com/devLoor1/FRONT-APP` → **Settings** → **Branches**
2. Adicione uma **Branch protection rule** para `main`:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (opcional)
   - ✅ Do not allow bypassing the above settings

## Web Compatibility Changes
The app has been adapted for web use with these modifications:

1. **Storage Abstraction** (`src/storages/`):
   - Uses `localStorage` on web
   - Falls back to `expo-secure-store` on native platforms
   - Applied to: `SecureStorage`, `CommonStorage`, `AuthStorage`

2. **API Configuration** (`src/services/api.ts`):
   - Reads `API_BASE_URL` from environment variables on web
   - Uses Expo config on native platforms
   - Properly detects web environment

3. **UI Fixes**:
   - Removed incompatible `react-native/Libraries/NewAppScreen` imports
   - Fixed theme color references for web compatibility

4. **Dependencies**:
   - `react-native-web@0.20.0` - React Native to web adapter
   - `react-dom@19.0.0` - React DOM for web rendering
   - `@lottiefiles/dotlottie-react` - Lottie animation support for web

## Deployment
Configured for autoscale deployment running `npm run web:replit` on port 5000.

## Post-Merge Setup
Configured in `scripts/post-merge.sh` to run `npm install --legacy-peer-deps` after merges (120s timeout).
