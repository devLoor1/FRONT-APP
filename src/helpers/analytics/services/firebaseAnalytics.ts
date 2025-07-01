import { firebaseAnalyticsInterface } from '../analyticsInteface';

type Props = firebaseAnalyticsInterface;

// Mock implementation for development
const mockAnalytics = {
  logEvent: async (eventName: string, params?: any) => {
    console.log('Firebase Analytics Event:', eventName, params);
  },
  logScreenView: async (params: any) => {
    console.log('Firebase Analytics Screen View:', params);
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
    console.log('Firebase Analytics Error:', error);
  }
}

export default { handleSendEvent };
