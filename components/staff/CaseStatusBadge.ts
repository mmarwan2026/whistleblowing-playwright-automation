import { Locator } from '@playwright/test';

export class CaseStatusBadge {
  constructor(private readonly root: Locator) {}
}
