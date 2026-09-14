import fs from 'node:fs/promises';

export default async function globalSetup() {
  await fs.mkdir('storage', { recursive: true });
  await fs.mkdir('test-results', { recursive: true });
}
