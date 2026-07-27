import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import {
  getSafeErrorContext,
  safeLogger,
  sanitizeEndpoint,
  sanitizeTelemetryRecord,
  sanitizeText,
} from '@/helpers/observability';

const Debug = {
  Init() {
    if (Constants.expoConfig?.extra?.env.production) {
      Sentry.init({
        dsn: 'https://66c42d300e0a448eb3cb3a1114d7a9ee@o344338.ingest.sentry.io/4504248431017984',
        debug: false,
        autoSessionTracking: true,
        enableNative: true,
        environment: Constants.expoConfig?.extra?.env.production ? 'production' : 'dev',
        sendDefaultPii: false,
        beforeSend(event) {
          event.user = undefined;
          event.message = event.message
            ? sanitizeText(event.message)
            : event.message;
          event.extra = sanitizeTelemetryRecord(event.extra);
          event.contexts = sanitizeTelemetryRecord(
            event.contexts
          ) as typeof event.contexts;
          event.tags = sanitizeTelemetryRecord(event.tags) as typeof event.tags;

          if (event.request) {
            event.request.url = sanitizeEndpoint(event.request.url);
            event.request.headers = undefined;
            event.request.cookies = undefined;
            event.request.data = undefined;
            event.request.query_string = undefined;
          }

          event.breadcrumbs = event.breadcrumbs?.map((breadcrumb) => ({
            ...breadcrumb,
            message: breadcrumb.message
              ? sanitizeText(breadcrumb.message)
              : breadcrumb.message,
            data: sanitizeTelemetryRecord(breadcrumb.data),
          }));

          event.exception?.values?.forEach((exception) => {
            if (exception.value) exception.value = sanitizeText(exception.value);
          });

          return event;
        },
      });
    }
  },
  Wrap(Component: Parameters<typeof Sentry.wrap>[0]): ReturnType<typeof Sentry.wrap> {
    if (Constants.expoConfig?.extra?.env.production) return Sentry.wrap(Component);
    return Component;
  },
  Capture(error: unknown) {
    const context = getSafeErrorContext(error);
    safeLogger.error('API request failed', context);

    if (Constants.expoConfig?.extra?.env.production) {
      const safeError = new Error(
        typeof context.message === 'string'
          ? context.message
          : 'API request failed'
      );
      Sentry.withScope((scope) => {
        scope.setContext('http', context);
        Sentry.captureException(safeError);
      });
    }
  },
};

export default Debug;
