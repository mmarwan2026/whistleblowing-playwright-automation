import { expect, Page } from '@playwright/test';

export class WorkflowAssertions {
  static async status(page: Page, status: string) {
    await expect(page.getByText(status, { exact: false })).toBeVisible();
  }
}
