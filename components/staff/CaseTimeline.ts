import { Locator } from '@playwright/test';

export class CaseTimeline {
  constructor(private readonly root: Locator) {}
}
