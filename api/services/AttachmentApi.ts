import { ApiClient } from '../client/ApiClient';

export class AttachmentApi {
  constructor(private readonly client: ApiClient) {}

  async upload(payload: unknown) {
    // TODO: replace with confirmed API endpoint.
    return this.client.post('/TODO/attachments', payload);
  }
}
