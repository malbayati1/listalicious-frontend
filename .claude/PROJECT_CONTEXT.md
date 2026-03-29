# Listalicious — Frontend Project Context

## Overview

Listalicious is a shared grocery list app built with React Native / Expo. Users can create an account, build grocery lists, and share them with family or friends. This document covers the frontend architecture, current state of implementation, and key conventions.

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | React Native 0.79.2, React 19 |
| App Platform | Expo ~53.0.9 |
| Routing | Expo Router ~5.0.6 (file-based) |
| UI Components | React Native Paper 5.10.2 (Material Design) |
| HTTP Client | Axios 1.11.0 |
| State Management | React Context API |
| Token Storage | Expo Secure Store (native), localStorage (web), in-memory fallback |
| Language | TypeScript 5.8.3 (strict mode) |
| Linting/Formatting | ESLint v9 (flat config), Prettier 3.6.2 |

---

## Project Structure

```
listalicious-frontend/
├── app/                          # Expo Router pages
│   ├── (app)/
│   │   ├── _layout.tsx           # Protected route guard (redirects to auth if no token)
│   │   └── index.tsx             # Grocery list page
│   ├── (auth)/
│   │   ├── _layout.tsx           # Auth guard (redirects to app if already logged in)
│   │   ├── index.tsx             # Welcome / landing page
│   │   ├── login.tsx             # Login page
│   │   └── register.tsx          # Register page
│   ├── _layout.tsx               # Root layout — wraps entire app in AuthProvider
│   └── index.tsx                 # Entry point — redirects to (auth)
│
├── src/
│   ├── api/
│   │   ├── authApi.tsx           # login() and registerUser() API calls
│   │   └── authClient.tsx        # Axios instance (base URL, token interceptor, 401 handling)
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state: token, user, isBootstrapping, login(), logout()
│   ├── screens/
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── GroceryListScreen.tsx
│   │   └── styles/               # StyleSheet files per screen
│   ├── types/
│   │   ├── LoginData.ts
│   │   ├── RegisterData.ts
│   │   └── User.ts
│   └── utils/
│       └── tokenStorage.ts       # Platform-aware token read/write/clear
│
└── assets/                       # Icons, splash screens, fonts
```

---

## Routing & Navigation

File-based routing via Expo Router:

```
/               → redirects to /(auth)
/(auth)/        → WelcomeScreen
/(auth)/login   → LoginScreen
/(auth)/register → RegisterScreen
/(app)/         → GroceryListScreen (protected)
```

**Route Protection Pattern:**
- `(auth)/_layout.tsx` — redirects to `/(app)` if a token exists
- `(app)/_layout.tsx` — redirects to `/(auth)` if no token
- Root `_layout.tsx` suppresses splash screen after bootstrapping completes

---

## Authentication

- OAuth-style flow: `POST /auth/login` with form-encoded `{ grant_type, username, password }`
- Registration: `POST /auth/register` with JSON `{ email, password, username }`
- Both return `{ user, access_token }`
- Token is stored via `tokenStorage.ts` (SecureStore on device, localStorage on web)
- All subsequent requests attach `Authorization: Bearer <token>` via Axios request interceptor
- On app launch, the stored token is loaded (bootstrapping). `isBootstrapping: true` prevents UI flash.

---

## API Client

**Base URL:**
- Dev: `http://192.168.50.207:8000` (local network IP)
- Prod: `https://prod` ← TODO: set real production URL

**Interceptors:**
- Request: attaches Bearer token if present
- Response: logs 401 errors (auto-redirect not yet implemented)

---

## Current State of Implementation

### Completed
- [x] User registration with email + password validation
- [x] User login with token storage
- [x] Secure, platform-aware token persistence
- [x] Auto-login on launch (bootstrap from stored token)
- [x] Logout
- [x] Protected route groups
- [x] Add / remove items in grocery list (in-memory only)

### Not Yet Implemented / TODO
- [ ] Grocery list backend integration (items not persisted to server)
- [ ] Shared lists (core feature — not started)
- [ ] Sharing lists with other users
- [ ] Real production API URL
- [ ] Automatic redirect on 401 (token expiry)
- [ ] Persistent error handling UX (currently uses `alert()`)
- [ ] Backend: any list/item CRUD endpoints

---

## Code Conventions

- **TypeScript strict mode** — no `any`, strict null checks
- **Double quotes**, semicolons, 2-space indent, LF line endings (see `.prettierrc.json`)
- **Path alias:** `@/*` maps to the root directory
- Screens live in `src/screens/`, styles in `src/screens/styles/`
- Expo Router pages in `app/` are thin wrappers that render screen components from `src/screens/`
- Platform-specific behavior (keyboard dismiss, web enter-key submit) handled inline in screen components

---

## Backend

The backend runs separately (not in this folder). Current known endpoints:

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in, receive access token |

No grocery list or sharing endpoints are connected yet.
