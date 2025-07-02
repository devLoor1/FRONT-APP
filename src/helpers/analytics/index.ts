import firebaseAnalytics from './services/firebaseAnalytics';
// import appsflyerAnalytics from './services/appsflyerAnalytics';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

type Params = {
  eventName?: string;
  pageName?: string;
  generalData?: {};
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

let identityId = ''

async function handleAnalyticsUserProfile(action: string, data: any = null) {
  if (action === 'sigIn') {
    identityId = data.Identity

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
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get push token
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Push token:', token);

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

    return
  }

  if (action === 'signOut') {
    identityId = ''
  }

  // Store user data for notifications
  console.log('User profile updated:', { Identity: identityId, ...data });
}

function Analytics({ eventName, pageName, generalData, exclusiveData }: Params) {
  if (Constants.expoConfig?.extra?.env.production) {
    // Log analytics event
    console.log('Analytics Event:', eventName || pageName || '');
    
    firebaseAnalytics.handleSendEvent({
      eventName,
      pageName,
      generalData,
      exclusiveData: exclusiveData?.firebase,
    }).catch(console.error);
    // appsflyerAnalytics.handleSendEvent({
    //   eventName,
    //   pageName,
    //   generalData,
    //   exclusiveData: exclusiveData?.firebase,
    // }).catch(console.error);
  }
}

export {
  Analytics,
  handleAnalyticsUserProfile
}
