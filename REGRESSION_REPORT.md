# Aura Whistleblowing Automation Regression Report

Date: 2026-10-19
Environment: Aura test portal
Browser: Chromium

## Result summary

| Area | Passed | Failed | Skipped | Status |
|---|---:|---:|---:|---|
| Public smoke | 42 | 0 | 0 | Passed |
| Unit tests | 6 | 0 | 0 | Passed |
| Core public E2E | 4 | 0 | 0 | Passed |
| Identified full-report follow-up E2E-006 | 1 | 0 | 0 | Passed |
| Multi-file evidence E2E | 0 | 1 | 0 | Application defect |
| Authenticated staff suites | Not run | Not run | Not run | Requires approved credentials |

## Confirmed application defect

`E2E-007` in [tests/e2e/04-submit-identified-full-report-follow-up.e2e.spec.ts](tests/e2e/04-submit-identified-full-report-follow-up.e2e.spec.ts) fails after two evidence files are uploaded.

Expected: two evidence-description textareas.

Actual: one textarea remains available; the second evidence row is incomplete. The test is intentionally left failing and is not skipped.

Artifacts are stored under `test-results/`, including the screenshot, video, error context, and trace for the failing run.

## Automation updates

- Migrated public smoke suites to the current Report Details and submission workflow.
- Updated Page Objects to use current accessible controls.
- Added current report-details model and Page Object coverage.
- Added identified full-report and follow-up E2E coverage.
- Added unit coverage for public Page Objects and submission assertions.
- Removed exposed credential values from `.env.example` and stopped logging access PINs.

## Remaining work

1. Fix the application multi-file evidence state/API payload handling.
2. Rerun `E2E-007` and the complete public E2E suite after the application fix.
3. Run authenticated staff suites with approved non-production credentials.
