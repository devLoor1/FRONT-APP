import LogRocket from '@logrocket/react-native';
import Constants from 'expo-constants';
import { sanitizeEndpoint } from '@/helpers/observability';

const LogRocketHelper = {
  Init() {
    if (Constants.expoConfig?.extra?.env.production) {
      LogRocket.init('wealth-money/mobile-live', {
        enableIPCapture: false,
        textSanitizer: 'excluded',
        console: {
          isEnabled: false,
          shouldAggregateConsoleErrors: false,
        },
        network: {
          isEnabled: true,
          requestSanitizer: (request) => ({
            ...request,
            url: sanitizeEndpoint(request.url) || '',
            headers: {},
            body: null,
            credentials: null,
            referrer: null,
          }),
          responseSanitizer: (response) => ({
            ...response,
            url: sanitizeEndpoint(response.url),
            headers: {},
            body: null,
          }),
        },
      });
    }
  },
};

export default LogRocketHelper;
