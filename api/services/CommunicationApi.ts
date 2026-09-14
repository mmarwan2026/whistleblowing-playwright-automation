import { ApiClient } from '../client/ApiClient';

export class CommunicationApi {
  constructor(private readonly client: ApiClient) {}

  async send(payload: unknown) {
    // TODO: replace with confirmed API endpoint.
    return this.client.post('/TODO/messages', payload);
  }
}
