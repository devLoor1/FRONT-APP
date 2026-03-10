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

## Project Structure
```
src/
  App.tsx           - Root component
  components/       - Reusable UI components
  context/          - React context providers (auth, theme, common)
  environments/     - Environment configs (DEV, PREVIEW, PROD)
  helpers/          - Utility helpers
  models/           - TypeScript type definitions
  pages/            - Screen components
  redux/            - Redux store, slices, hooks
  routes/           - Navigation route definitions
  services/         - API service modules
  styles/           - Theme and global styles
  utils/            - Utility functions
assets/             - Images, icons, fonts, animations
```

## Environment Configuration
Environment settings are in `src/environments/environment.json` with three profiles:
- **DEV**: Development environment (boss-equity-api.herokuapp.com)
- **PREVIEW**: Preview/staging environment
- **PROD**: Production environment (api.loor.vc)

## Running in Replit
The app runs via Metro bundler's web support on port 5000:
```
npm run web:replit
```
This sets `RCT_METRO_PORT=5000` and starts Expo in web mode.

## Key Dependencies for Web
- `react-native-web@0.20.0` - React Native to web adapter
- `react-dom@19.0.0` - React DOM for web rendering
- `@expo/metro-runtime` - Metro runtime for web
- `@lottiefiles/dotlottie-react` - Lottie animation support for web

## Changes Made for Replit Compatibility
1. Added `web:replit` npm script with port 5000 via `RCT_METRO_PORT=5000`
2. Removed `react-native/Libraries/NewAppScreen` import (replaced `Colors.darker` with `#222`)
3. Added `assets/favicon.png` (copied from icon)
4. Installed web-specific packages: `react-native-web`, `react-dom`, `@expo/metro-runtime`, `@lottiefiles/dotlottie-react`, `expo-build-properties`

## Deployment
Configured for autoscale deployment running `npm run web:replit`.
