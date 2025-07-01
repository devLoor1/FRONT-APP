import appsFlyer from 'react-native-appsflyer';
import { appsflyerAnalyticsInterface } from '../analyticsInteface';

type Props = appsflyerAnalyticsInterface;

async function handleSendEvent({ eventName, pageName, generalData, exclusiveData }: Props) {
  if (eventName) {
    appsFlyer.logEvent(
      eventName,
      {
        ...generalData,
        ...exclusiveData,
      },
      res => {
        console.log(res);
      },
      err => {
        console.error('err');
        console.error(err);
      }
    );
  }
  if (pageName) {
    appsFlyer.logEvent(
      pageName,
      {
        pageName,
      },
      res => {
        console.log(res);
      },
      err => {
        console.error('err 2');
        console.error(err);
      }
    );
  }
}

export default { handleSendEvent };
