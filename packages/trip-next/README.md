---

## Implementation Plan

### Tech Stack

- **Backend:** ASP.NET Core (.NET 9), Dapper, PostgreSQL
- **Frontend:** Next.js 16 (App Router), MUI, TanStack React Query, Axios
- **Auth:** JWT tokens

### Frontend File Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root: ThemeProvider, QueryProvider, AuthProvider
│   ├── page.tsx                    # Landing / redirect to dashboard
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx              # Auth guard → redirect to /login
│   │   ├── dashboard/page.tsx      # Trip overview + balances
│   │   └── trips/
│   │       ├── page.tsx            # Trip list + create
│   │       └── [tripId]/
│   │           ├── page.tsx        # Trip detail + members
│   │           ├── members/page.tsx
│   │           └── expenses/
│   │               ├── page.tsx    # Expense list + add
│   │               └── [expenseId]/page.tsx
├── components/
│   ├── auth/          LoginForm, RegisterForm
│   ├── trips/         TripCard, TripList, CreateTripDialog, MemberList
│   ├── expenses/      ExpenseCard, ExpenseList, AddExpenseDialog, SplitBreakdown
│   ├── dashboard/     BalanceSummary
│   └── shared/        Navbar, LoadingSpinner
├── lib/
│   ├── api.ts              # Axios instance + JWT interceptor
│   ├── queryClient.ts      # TanStack Query config
│   └── auth.ts             # Token storage helpers
├── hooks/
│   ├── useAuth.ts
│   ├── useTrips.ts
│   ├── useExpenses.ts
│   └── useBalances.ts
├── types/
│   └── index.ts            # User, Trip, Expense, Balance, etc.
├── providers/
│   ├── AuthProvider.tsx
│   ├── QueryProvider.tsx
│   └── ThemeProvider.tsx
└── theme/
    └── theme.ts            # MUI createTheme
```

### Implementation Phases

#### Phase 1 — Backend: Auth Infrastructure

- [ ] Add `POST /api/users/login` → accepts `{ email, password }`, returns JWT
- [ ] Add JWT config in `appsettings.json` (Key, Issuer, Audience, ExpiryMinutes)
- [ ] Install `Microsoft.AspNetCore.Authentication.JwtBearer`
- [ ] Configure JWT middleware in `Program.cs`
- [ ] Add `[Authorize]` to trip/expense controllers, `[AllowAnonymous]` to login/register
- [ ] Add `GET /api/users/me` → returns current user from JWT claims

#### Phase 2 — Backend: Missing APIs

- [ ] Add `TripMember` model + repository + endpoints (`POST/GET/DELETE /api/trips/{tripId}/members`)
- [ ] Add `ExpenseParticipant` model + repository + endpoints
- [ ] Add `GET /api/trips/{tripId}/balances` → who owes whom calculation

#### Phase 3 — Frontend: Foundation

- [ ] Install deps: `@mui/material @mui/icons-material @emotion/react @emotion/styled @tanstack/react-query axios`
- [ ] Create MUI theme (`src/theme/theme.ts`)
- [ ] Create providers: ThemeProvider, QueryProvider
- [ ] Create API client (`src/lib/api.ts`) with JWT interceptor
- [ ] Create TypeScript types (`src/types/index.ts`)
- [ ] Wire all providers in root `layout.tsx`

#### Phase 4 — Frontend: Auth

- [ ] Create `src/lib/auth.ts` — JWT localStorage helpers
- [ ] Create `AuthProvider` with context: user, login(), register(), logout()
- [ ] Create `useAuth` hook
- [ ] Build LoginForm + RegisterForm components
- [ ] Create login/register pages
- [ ] Create protected layout with auth guard

#### Phase 5 — Frontend: Trips

- [ ] Create `useTrips` hook (list, detail, create mutations)
- [ ] Build TripCard, TripList, CreateTripDialog, MemberList components
- [ ] Create trips list page + trip detail page

#### Phase 6 — Frontend: Expenses

- [ ] Create `useExpenses` hook
- [ ] Build ExpenseCard, ExpenseList, AddExpenseDialog, SplitBreakdown components
- [ ] Create expenses page with participant picker

#### Phase 7 — Frontend: Dashboard

- [ ] Create `useBalances` hook
- [ ] Build BalanceSummary component ("X owes Y $Z")
- [ ] Create dashboard page with trip overview

#### Phase 8 — Shared UI

- [ ] Navbar with navigation + user menu + logout
- [ ] LoadingSpinner, error states

### Verification

- `npm run build` — no TypeScript errors
- Auth flow: register → login → token stored → protected routes work
- CRUD: create trip → add members → add expense → view balances
- Error handling: invalid login, network errors, 404s

### Key Decisions

- **MUI** for component library
- **JWT in localStorage** (simpler SPA approach; can migrate to HTTP-only cookies later)
- **TanStack React Query** for all data fetching (client-side)
- **Axios** for HTTP client with interceptors
- **Route groups** `(auth)` and `(protected)` for layout separation
