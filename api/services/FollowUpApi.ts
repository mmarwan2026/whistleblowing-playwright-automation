import { ApiClient } from '../client/ApiClient';

export class FollowUpApi {
  constructor(private readonly client: ApiClient) {}

  async getCase(payload: unknown) {
    // TODO: replace with confirmed API endpoint.
    return this.client.post('/TODO/follow-up', payload);
  }
}
