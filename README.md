# Whistleblowing Playwright Automation Framework

Production-style Playwright + TypeScript framework for public whistleblowing intake,
follow-up, staff workflows, API setup/cleanup, role-based authentication, security,
permissions, reporting and CI.

## Architecture

Tests → Business Flows → Page Objects → Reusable Components → Playwright

Supporting layers:

- Fixtures
- Models
- Factories
- API services
- Assertions
- Utilities
- Configuration
- Role-based storage state
- CI/CD

## Quick Start

```powershell
npm install
npx playwright install
Copy-Item .env.example .env
```

Update `.env` with your environment URLs and staff credentials.

Run:

```powershell
npm test
npm run test:smoke
npm run test:regression
npm run test:chromium
npm run test:debug
npm run test:ui
npm run report
```

## Important

Some public Reporter Info labels are based on confirmed UI text.

Other application-specific routes, locators, dropdown values and API endpoints are
marked with `TODO` where the real system details have not yet been confirmed.
Do not replace those TODOs by guessing.
