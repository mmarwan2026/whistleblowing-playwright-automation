# Whistleblowing Portal — Browser Execution Bug Report

Application: `https://aura-web-whistleblowing-test.apps.cih-main.qo4k.p1.openshiftapps.com/`

Execution date: 2026-10-22

## Execution scope

The browser-executable public flows were exercised: home page, language switch, Quick Exit, support-channel links, report notice, report wizard entry, anonymous reporter validation, follow-up invalid credentials, login invalid credentials, and password-recovery page access.

Unit tests, backend integration tests, successful authentication, role permissions, file upload, real report submission, and valid follow-up were not executed because they require implementation access, working backend services, test files, valid session data, or creation of an external case.

## Defects

### BUG-007 — Declaration submit-state contract requires clarification

- **Severity:** Unconfirmed
- **Priority:** Medium
- **Area:** Declaration step / report submission
- **Precondition:** The report wizard has reached Declaration and the acknowledgement checkbox is unchecked.
- **Steps to reproduce:**
  1. Open `/report`.
  2. Confirm the reporting notice.
  3. Complete the wizard using the permitted anonymous path and select no documents.
  4. Stop on Declaration.
  5. Leave “I have read and agree with the above and wish to submit my report.” unchecked.
  6. Inspect the Submit Report button state.
- **Test data:** Unchecked declaration acknowledgement.
- **Expected result:** The product behavior must be clarified. `DeclarationStep.ts` exposes `verifySubmitDisabled()`, but the existing smoke test explicitly expects the button to be enabled before acknowledgement and verifies that clicking it does not advance.
- **Actual result:** The live UI exposed Submit Report as enabled while the acknowledgement was unchecked. This is not confirmed as a defect because the existing automated smoke test expects the same state.
- **Evidence:** The Declaration accessibility snapshot showed an unchecked acknowledgement checkbox and an active Submit Report button. The existing page-object test only verifies the checked/enabled state and does not test this negative state.
- **Status:** Requirement clarification required, not confirmed as a bug
- **Assumption:** The acknowledgement is mandatory for successful submission, but the button may intentionally remain enabled while the click handler blocks progression.

### BUG-001 — Quick Exit does not exit or hide the portal

- **Severity:** High
- **Priority:** High
- **Area:** Public home page / safety control
- **Precondition:** Application is reachable and the home page is open.
- **Steps to reproduce:**
  1. Open the application home page.
  2. If required, select English or Arabic.
  3. Select the Quick Exit button.
  4. Observe the URL, page content, browser history, and active tab.
- **Test data:** None.
- **Expected result:** The portal immediately navigates to a safe neutral destination or hides/removes sensitive portal content, according to the product’s safety behavior.
- **Actual result:** The URL and portal content remain unchanged; no visible exit action occurs.
- **Evidence:** The page remained on `/` with the same home content after clicking Quick Exit.
- **Status:** Failed
- **Assumption:** Quick Exit is intended to protect a user from exposing the portal on screen because of its label and placement.

### BUG-002 — Support-channel links point to unrelated generic websites

- **Severity:** High
- **Priority:** High
- **Area:** Reporting and support channels
- **Precondition:** Application is reachable and the home page is open.
- **Steps to reproduce:**
  1. Scroll to “The right channel for every concern”.
  2. Select Open for Welfare and record the destination.
  3. Return to the portal and repeat for Grievance, Cyber Security, Security, and Health & Safety.
- **Test data:** None.
- **Expected result:** Each card opens the configured official channel for the concern described by that card.
- **Actual result:** Observed destinations were Google, Facebook, X, Instagram, and Microsoft respectively.
- **Evidence:** Accessibility snapshots exposed the following hrefs: `google.com`, `facebook.com`, `x.com`, `instagram.com`, and `microsoft.com`.
- **Status:** Failed / configuration defect suspected
- **Assumption:** These destinations are placeholders or test fixtures. If they are intentional, the business requirement must explicitly document why these unrelated destinations are correct.

### BUG-003 — Arabic localization is incomplete and contains incorrect text

- **Severity:** Medium
- **Priority:** Medium
- **Area:** Localization
- **Precondition:** Application is reachable and the language selector is available.
- **Steps to reproduce:**
  1. Open the home page.
  2. Select Arabic from the language selector.
  3. Review the main headings, action cards, support-channel cards, and footer.
- **Test data:** Arabic language.
- **Expected result:** All user-facing text is translated consistently into Arabic and terminology is grammatically correct.
- **Actual result:** Several support-channel names and descriptions remain in English, the mixed-language hero text remains in English, and the follow-up card displays “Folllow up”.
- **Evidence:** Arabic page showed English labels such as “Welfare”, “Grievance”, “Cyber Security”, “Security”, and “Health & Safety”; “Folllow up” contains an extra `l`.
- **Status:** Failed
- **Assumption:** The presence of an Arabic language option implies complete localization of visible user-facing content.

### BUG-004 — Invalid login reports service unavailability instead of an authentication error

- **Severity:** High
- **Priority:** High
- **Area:** Staff authentication
- **Precondition:** Application is reachable and the Login page is open.
- **Steps to reproduce:**
  1. Enter `invalid@example.com` in Email/Username.
  2. Enter `WrongPassword!` in Password.
  3. Select Login.
  4. Observe the modal dialog.
- **Test data:** Invalid username and password.
- **Expected result:** The user remains logged out and receives a clear invalid-credentials message, without revealing account existence.
- **Actual result:** A dialog titled “Login failed” displays “Login service unavailable”.
- **Evidence:** Browser dialog text was exactly “Login failed — Login service unavailable”; console output also reported missing pre-login session-token services and a failed lookup request.
- **Status:** Failed
- **Assumption:** Invalid credentials should be processed by the authentication service. If the service is intentionally unavailable in this environment, the environment should be marked unavailable rather than presenting a normal login page.

### BUG-005 — Identified reporter required fields provide no visible validation feedback

- **Severity:** High
- **Priority:** High
- **Area:** New report / Reporter Information
- **Precondition:** Application is reachable, the reporting notice has been confirmed, and the report wizard is on Reporter Information with anonymous mode disabled.
- **Steps to reproduce:**
  1. Open `/report`.
  2. Select Confirm and continue.
  3. Leave First Name, Last Name, Company, Department, and Position empty.
  4. Leave communication details empty.
  5. Select Next.
  6. Observe the page, field states, error messages, and progress indicator.
- **Test data:** Empty values.
- **Expected result:** The wizard remains on Reporter Information and every required field displays clear validation feedback.
- **Actual result:** The page remained on Reporter Information, but no visible field-level validation message or alert appeared in the observed state.
- **Evidence:** The page showed the same empty form and unchanged progress state after Next was selected.
- **Status:** Failed / validation feedback defect suspected
- **Assumption:** Asterisk-marked fields are required and must provide visible feedback when the user attempts to continue without them.

### BUG-006 — Pre-login system lookup calls fail because of missing session context

- **Severity:** High
- **Priority:** High
- **Area:** Pre-login service integration
- **Precondition:** Open `/login` or `/forgetPassword` while unauthenticated.
- **Steps to reproduce:**
  1. Open `/login`.
  2. Observe browser console/network errors where available.
  3. Open `/forgetPassword`.
  4. Observe the same pre-login requests.
- **Test data:** No session token.
- **Expected result:** Public pages load their required system text, lookup data, and branding without requiring an authenticated session, or show a controlled fallback without console errors.
- **Actual result:** Browser output reported “Missing SessionToken” for SystemTxt, pre-system lookups, and logo retrieval; one resource also returned 404.
- **Evidence:** Console warnings included `Missing SessionToken for /api/proxy/rest/SystemTxt/SystemTxt`, `getPreSystemLookups`, and `getlogobycompany/NTG`.
- **Status:** Failed / integration defect suspected
- **Assumption:** Public unauthenticated pages are expected to support pre-login requests using a public tenant/company context or a controlled fallback.

## Confirmed negative-path results

The following cases were executed successfully and did not produce a defect during this run:

1. Empty Follow Up form: Access Report was disabled.
2. Fabricated Follow Up credentials (`REF-INVALID` / `CODE-INVALID`): the portal displayed “No Reports match these credentials” and did not expose report data.
3. Anonymous Reporter Information without a category: the category field displayed “This field is required.”
4. Anonymous report information dialog: the anonymity guidance dialog appeared before continuing.
5. Report wizard progression with valid sample data: the flow reached Person(s) Involved, Entities Involved, Previous Reporting, Evidence, and Declaration.

## Not executable in this run

The following require additional access or deliberate external state creation:

- Successful staff login and role-permission coverage.
- Real report submission and generated Reference Number/Access Code.
- Valid follow-up, status update, and anonymous reply.
- Evidence upload limits and file-type validation.
- Network interruption, timeout, rate-limit, and API authorization testing.
- Unit-level validation and code coverage.
