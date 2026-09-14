import { Locator } from '@playwright/test';

export class CaseHeader {
  constructor(private readonly root: Locator) {}
}
