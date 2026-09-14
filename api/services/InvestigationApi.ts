import { ApiClient } from '../client/ApiClient';

export class InvestigationApi {
  constructor(private readonly client: ApiClient) {}

  async create(payload: unknown) {
    // TODO: replace with confirmed API endpoint.
    return this.client.post('/TODO/investigations', payload);
  }
}
