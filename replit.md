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
- `GITHUB_PAT`: Personal Access Token with `repo` + `workflow` scopes (used in authenticated remote URL for git push)

### Running in Replit
The app runs on port 5000:
```bash
npm run web:replit
```

## Git Workflow — Develop → Main

The project uses a two-branch flow to separate staging from production:

```
Replit (local branch: main)
       │
       ▼  git push   [refspec: main → develop]
origin/develop  ──── staging / QA / homologação
       │
       ▼  Pull Request approved & merged
origin/main  ──── production
```

### How it works

- **All work in Replit** is committed on the local `main` branch.
- **Every `git push`** sends code to `origin/develop` on GitHub — never to `origin/main`.
  This is enforced by a persistent git refspec (not by branch tracking metadata):
  ```
  remote.origin.push = refs/heads/main:refs/heads/develop
  ```
- **To release to production**, open a Pull Request from `develop` → `main` on GitHub
  (manually or via the GitHub Actions workflow below).

### Verify the push config

```bash
git config --get-all remote.origin.push
# Expected output: refs/heads/main:refs/heads/develop
```

If this setting is ever lost (e.g. after a fresh clone), restore it with:

```bash
git remote set-url origin "https://${GITHUB_PAT}@github.com/devLoor1/FRONT-APP.git"
git config remote.origin.push 'refs/heads/main:refs/heads/develop'
git config push.default upstream
```

### Promote develop → main (GitHub Actions)

A manual workflow is available at:
`https://github.com/devLoor1/FRONT-APP/actions/workflows/promote-to-main.yml`

Steps:
1. Go to the repository on GitHub: `https://github.com/devLoor1/FRONT-APP`
2. Navigate to **Actions** → **"Promover develop para main"**
3. Click **"Run workflow"**
4. Optionally fill in a PR title and description, then click **"Run workflow"**
5. A Pull Request will be created automatically from `develop` → `main`
6. Review and merge the PR to publish to production

The workflow:
- Checks whether `develop` has any commits ahead of `main` before creating a PR
- Reuses an existing open PR instead of creating duplicates

### Protect the main branch on GitHub (recommended)

To prevent direct pushes to `main` without a PR:
1. Go to: `github.com/devLoor1/FRONT-APP` → **Settings** → **Branches**
2. Add a **Branch protection rule** for `main`:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (optional)
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
