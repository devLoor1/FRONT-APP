import appsFlyer from 'react-native-appsflyer';
import { appsflyerAnalyticsInterface } from '../analyticsInteface';
import {
  safeLogger,
  sanitizeTelemetryRecord,
  sanitizeText,
} from '@/helpers/observability';

type Props = appsflyerAnalyticsInterface;

async function handleSendEvent({ eventName, pageName, generalData, exclusiveData }: Props) {
  if (eventName) {
    const safeEventName = sanitizeText(eventName);
    appsFlyer.logEvent(
      safeEventName,
      sanitizeTelemetryRecord({
        ...generalData,
        ...exclusiveData,
      }),
      () => {
        safeLogger.info('AppsFlyer event sent', { eventName: safeEventName });
      },
      (err: unknown) => {
        safeLogger.error('AppsFlyer event failed', err);
      }
    );
  }
  if (pageName) {
    const safePageName = sanitizeText(pageName);
    appsFlyer.logEvent(
      safePageName,
      {
        pageName: safePageName,
      },
      () => {
        safeLogger.info('AppsFlyer screen event sent', {
          pageName: safePageName,
        });
      },
      (err: unknown) => {
        safeLogger.error('AppsFlyer screen event failed', err);
      }
    );
  }
}

export default { handleSendEvent };
