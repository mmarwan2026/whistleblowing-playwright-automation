import { Page } from '@playwright/test';

export class DownloadHelper {
  static async capture(page: Page, action: () => Promise<void>) {
    const promise = page.waitForEvent('download');
    await action();
    return promise;
  }
}
