import 'dotenv/config';

export interface EnvironmentConfig {
  name: string;
  publicUrl: string;
  staffUrl: string;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getEnvironment(): EnvironmentConfig {
  const name = process.env.TEST_ENV?.trim() || 'aura';

  const publicUrl = process.env.BASE_URL?.trim();
  const staffUrl = process.env.STAFF_URL?.trim();

  if (!publicUrl) {
    throw new Error('BASE_URL is required in .env');
  }

  if (!staffUrl) {
    throw new Error('STAFF_URL is required in .env');
  }


  return {
    name,
    publicUrl: normalizeUrl(publicUrl),
    staffUrl: normalizeUrl(staffUrl)
  };
}
