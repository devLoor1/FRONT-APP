import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

type User = {
  name?: string;
  email: string;
  status?: string;
  cellphone?: string;
};

const Debug = {
  Init() {
    if (Constants.expoConfig?.extra?.env.production) {
      Sentry.init({
        dsn: 'https://66c42d300e0a448eb3cb3a1114d7a9ee@o344338.ingest.sentry.io/4504248431017984',
        debug: Constants.expoConfig?.extra?.env.production ? true : false,
        autoSessionTracking: true,
        enableNative: true,
        environment: Constants.expoConfig?.extra?.env.production ? 'production' : 'dev',
      });
    }
  },
  Wrap(Component: Parameters<typeof Sentry.wrap>[0]): ReturnType<typeof Sentry.wrap> {
    if (Constants.expoConfig?.extra?.env.production) return Sentry.wrap(Component);
    return Component;
  },
  Capture(error: any) {
    Sentry.captureException(error.response);
  },
  SetUser(user: User) {
    Sentry.setUser(user);
  },
};

export default Debug;
