import { Locator } from '@playwright/test';

export class ApprovalPanel {
  constructor(private readonly root: Locator) {}
}
