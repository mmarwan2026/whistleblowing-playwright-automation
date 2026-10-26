export const Routes = {
  public: {
    home: '/',
    submitReport: '/report',
    followUp: '/follow-up'
  },
  staff: {
    login: '/login',
    dashboard: 'aura/dashboard'
  }
} as const;

export function resolveRoute(route: string): string {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) return route;

  const appBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return new URL(route.replace(/^\/+/, ''), appBaseUrl).toString();
}
