import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';
import moment from 'moment';
import * as environment from './src/environments/environment.json';

export default ({ config }: ConfigContext): ExpoConfig => {
  let envVars = environment.prod;
  if (process.env.ENV !== 'PROD') {
    envVars = environment.dev;
  }

  return {
    ...config,
    name: config.name ?? 'Loor',
    slug: config.slug ?? 'loor',
    extra: {
      ...config.extra,
      env: envVars,
      version: moment.utc().format('YYYYMMDD-HHmm'),
    },
  };
};