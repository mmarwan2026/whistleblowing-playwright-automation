import { chromium } from '@playwright/test';
import { LoginPage } from '../pages/staff/LoginPage';

const accounts = [
  ['investigator', 'INVESTIGATOR_EMAIL', 'INVESTIGATOR_PASSWORD'],
  ['lead-investigator', 'LEAD_INVESTIGATOR_EMAIL', 'LEAD_INVESTIGATOR_PASSWORD'],
  ['hod', 'HOD_EMAIL', 'HOD_PASSWORD'],
  ['gciao', 'GCIAO_EMAIL', 'GCIAO_PASSWORD'],
  ['grc', 'GRC_EMAIL', 'GRC_PASSWORD'],
  ['hr', 'HR_EMAIL', 'HR_PASSWORD'],
  ['legal', 'LEGAL_EMAIL', 'LEGAL_PASSWORD'],
  ['admin', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
] as const;

async function main() {
  const browser = await chromium.launch();

  for (const [name, emailKey, passwordKey] of accounts) {
    const email = process.env[emailKey];
    const password = process.env[passwordKey];

    if (!email || !password) continue;

    const context = await browser.newContext();
    const page = await context.newPage();

    const login = new LoginPage(page);
    await login.open();
    await login.login(email, password);

    await context.storageState({ path: `storage/${name}.json` });
    await context.close();
  }

  await browser.close();
}

main();
