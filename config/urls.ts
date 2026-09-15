export const Routes = {
  public: {
    home: '/',
    submitReport: 'aura/report',
    followUp: 'aura/follow-up'
  },
  staff: {
    login: '/login',
    dashboard: '/dashboard'
  }
} as const;
