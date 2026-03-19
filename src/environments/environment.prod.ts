export const environment = {
  production:   true,
  apiUrl:       'https://api.myapp.com/api/v1',
  appName:      'EnterpriseApp',
  appVersion:   '1.0.0',
  featureFlags: {
    newDashboard:  true,
    betaReports:   false,
    darkMode:      true,
    multiLanguage: true,
  },
} as const;