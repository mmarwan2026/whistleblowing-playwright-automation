import { ApiClient } from '../client/ApiClient';

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  async login(payload: unknown) {
    // TODO: replace with confirmed API endpoint.
    return this.client.post('/TODO/auth/login', payload);
  }
}
