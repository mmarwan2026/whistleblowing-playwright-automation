import { request } from '@playwright/test';
import { getEnvironment } from '../config/environments';

async function main() {
  const env = getEnvironment();
  const ctx = await request.newContext();

  for (const url of [env.publicUrl, env.staffUrl, env.apiUrl]) {
    const response = await ctx.get(url);
    console.log(url, response.status());
  }

  await ctx.dispose();
}

main();
