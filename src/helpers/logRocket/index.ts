import LogRocket from '@logrocket/react-native';
import Constants from 'expo-constants';

type User = {
  name?: string;
  email: string;
};

const LogRocketHelper = {
  Init() {
    if (Constants.expoConfig?.extra?.env.production) {
      LogRocket.init('wealth-money/mobile-live');
    }
  },
  SetUser(user: User) {
    if (Constants.expoConfig?.extra?.env.production) {
      LogRocket.identify(user.email, user);
    }
  },
};

export default LogRocketHelper;
