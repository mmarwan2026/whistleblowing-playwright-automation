import { Locator } from '@playwright/test';

export class CaseStatus {
  constructor(private readonly root: Locator) {}
}
