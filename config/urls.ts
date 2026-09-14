export const Routes = {
  public: {
    home: '/',
    submitReport: 'aura/report',
    followUp: '/follow-up'
  },
  staff: {
    login: '/login',
    dashboard: '/dashboard'
  }
} as const;
