import { firebaseAnalyticsInterface } from '../analyticsInteface';
import { safeLogger, sanitizeTelemetryRecord } from '@/helpers/observability';

type Props = firebaseAnalyticsInterface;

// Mock implementation for development
const mockAnalytics = {
  logEvent: async (eventName: string, params?: unknown) => {
    safeLogger.info('Firebase Analytics Event', {
      eventName,
      params: sanitizeTelemetryRecord(params),
    });
  },
  logScreenView: async (params: unknown) => {
    safeLogger.info(
      'Firebase Analytics Screen View',
      sanitizeTelemetryRecord(params)
    );
  }
};

async function handleSendEvent({ eventName, pageName, generalData, exclusiveData }: Props) {
  try {
    if (eventName) {
      await mockAnalytics.logEvent(eventName, {
        ...generalData,
        ...exclusiveData,
      });
    }
    if (pageName) {
      await mockAnalytics.logScreenView({ screen_name: pageName, screen_class: pageName });
    }
  } catch (error) {
    safeLogger.error('Firebase Analytics Error', error);
  }
}

export default { handleSendEvent };
