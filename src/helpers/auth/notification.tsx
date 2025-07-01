import messaging, { firebase } from '@react-native-firebase/messaging';

let token;

async function GetNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
  }

  token = await firebase.messaging().getToken();

  return token;
}

export default GetNotificationPermission;
