export const environment = {
  production:   false,
  apiUrl:       '/api',
  // apiUrl:       'http://localhost:5111/api',
  appName:      'EnterpriseApp',
  appVersion:   '1.0.0',
  featureFlags: {
    newDashboard:  true,
    betaReports:   false,
    darkMode:      true,
    multiLanguage: true,
  },
} as const;