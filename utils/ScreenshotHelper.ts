import { Page, TestInfo } from '@playwright/test';

export class ScreenshotHelper {
  static async attach(page: Page, testInfo: TestInfo, name = 'screenshot') {
    const body = await page.screenshot({ fullPage: true });
    await testInfo.attach(name, { body, contentType: 'image/png' });
  }
}
