import { Locator } from '@playwright/test';

export class AuditTrail {
  constructor(private readonly root: Locator) {}
}
