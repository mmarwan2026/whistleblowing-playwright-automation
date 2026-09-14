import { ApiClient } from '../client/ApiClient';

export class AssignmentApi {
  constructor(private readonly client: ApiClient) {}

  async assign(payload: unknown) {
    // TODO: replace with confirmed API endpoint.
    return this.client.post('/TODO/assignments', payload);
  }
}
