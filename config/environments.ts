export interface EnvironmentConfig {
  publicUrl: string;
  staffUrl: string;
  apiUrl: string;
}

export function getEnvironment(): EnvironmentConfig {
  const publicUrl = process.env.BASE_URL;
  const staffUrl = process.env.STAFF_URL;
  const apiUrl = process.env.API_URL;

  if (!publicUrl) throw new Error('BASE_URL is required.');
  if (!staffUrl) throw new Error('STAFF_URL is required.');
  if (!apiUrl) throw new Error('API_URL is required.');

  return { publicUrl, staffUrl, apiUrl };
}
