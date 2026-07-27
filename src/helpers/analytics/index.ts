import firebaseAnalytics from './services/firebaseAnalytics';
// import appsflyerAnalytics from './services/appsflyerAnalytics';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {
  safeLogger,
  sanitizeTelemetryRecord,
  sanitizeText,
} from '@/helpers/observability';

type Params = {
  eventName?: string;
  pageName?: string;
  generalData?: Record<string, unknown>;
  exclusiveData?: {
    firebase?: {
      cod_oportunidade?: string;
      risco_oportunidade?: string;
      valor_cota?: number;
      quantidade_cotas?: number;
    };
    appsFlyer?: {
      cod_oportunidade?: string;
      risco_oportunidade?: string;
      valor_cota?: number;
      quantidade_cotas?: number;
    };
  };
};

async function handleAnalyticsUserProfile(action: 'signIn' | 'signOut') {
  if (action === 'signIn') {
    // Configure notifications
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      safeLogger.warn('Push notification permission was not granted');
      return;
    }

    // Keep notification registration without exposing the generated token.
    await Notifications.getExpoPushTokenAsync();

    // Create notification channel (Android)
    if (Constants.expoConfig?.extra?.env.production) {
      await Notifications.setNotificationChannelAsync('LoorChanel', {
        name: 'Loor Channel Notification',
        description: 'Canal de Push Notifications utilizado pela Loor',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return;
  }
}

function Analytics({ eventName, pageName, generalData, exclusiveData }: Params) {
  if (Constants.expoConfig?.extra?.env.production) {
    firebaseAnalytics.handleSendEvent({
      eventName: eventName ? sanitizeText(eventName) : undefined,
      pageName: pageName ? sanitizeText(pageName) : undefined,
      generalData: sanitizeTelemetryRecord(generalData),
      exclusiveData: sanitizeTelemetryRecord(exclusiveData?.firebase),
    }).catch((error) => {
      safeLogger.error('Analytics event failed', error);
    });
  }
}

export {
  Analytics,
  handleAnalyticsUserProfile
}
