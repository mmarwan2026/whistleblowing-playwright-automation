import { Locator } from '@playwright/test';

export class QuickExit {
  constructor(private readonly root: Locator) {}
}
