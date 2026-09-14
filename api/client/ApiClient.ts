import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(url: string): Promise<T> {
    const response = await this.request.get(url);
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.request.post(url, { data });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.request.patch(url, { data });
    expect(response.ok()).toBeTruthy();
    return response.json() as Promise<T>;
  }

  async delete(url: string) {
    const response = await this.request.delete(url);
    expect(response.ok()).toBeTruthy();
  }
}
