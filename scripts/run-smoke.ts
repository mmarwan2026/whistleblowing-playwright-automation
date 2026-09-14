import { execSync } from 'node:child_process';

execSync('npx playwright test --grep @smoke --project=chromium', {
  stdio: 'inherit'
});
