import { expect, APIResponse } from '@playwright/test';

export class ApiAssertions {
  static async ok(response: APIResponse) {
    expect(response.ok()).toBeTruthy();
  }
}
