import { ConfigContext, ExpoConfig } from '@expo/config';
import 'dotenv/config';
import moment from 'moment';
import * as environment from './src/environments/environment.json';

export default ({ config }: ConfigContext): ExpoConfig => {
  
  let envVars =
      process.env.ENV == 'PROD'
      ? environment.prod
      : environment.dev;

  envVars = {
    ...environment.base,
    ...envVars
  };

  return {
    'name': 'Loor',
    'slug': 'app-loor-investor',
    'version': '1.0.0',
    'scheme': 'loor',
    'orientation': 'portrait',
    'icon': './assets/icons/icon-loor-v2.png',
    'userInterfaceStyle': 'light',
    'newArchEnabled': true,
    'splash': {
      'image': './assets/splash-loor.png',
      'resizeMode': 'contain',
      'backgroundColor': '#F8F9FB'
    },
    'ios': {
      'supportsTablet': true,
      'bundleIdentifier': 'vc.loor.investor',
      'infoPlist': {
        'ITSAppUsesNonExemptEncryption': false,
        "NSFaceIDUsageDescription": "A Loor pode utilizar o Face ID / Touch ID para autenticar você e simplificar a sua experiência.",
        "NSLocationAlwaysUsageDescription": "A Loor utiliza a sua localização para o sistema antifraude e garantir a segurança da sua conta.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "A Loor utiliza a sua localização para o sistema antifraude e garantir a segurança da sua conta.",
        "NSLocationWhenInUseUsageDescription": "A Loor utiliza a sua localização para o sistema antifraude e garantir a segurança da sua conta.",
        "NSCameraUsageDescription": "A Loor pode utilizar a câmera para validação de documentação."
      }
    },
    'android': {
      'adaptiveIcon': {
        'foregroundImage': './assets/icons/icon-adaptive.png',
        'backgroundColor': '#ffffff'
      },
      'edgeToEdgeEnabled': true,
      'package': 'vc.loor.investor'
    },
    'web': {
      'favicon': './assets/favicon.png'
    },
    'plugins': [
      'expo-secure-store',
      'expo-notifications',
      '@logrocket/react-native',
      [
        'expo-build-properties',
        {
          'android': {
            'minSdkVersion': 25,
            'ndkVersion': '27.2.12479018'
          }
        }
      ]
    ],
    'owner': 'loor-investimentos',
    'runtimeVersion': {
      'policy': 'appVersion'
    },
    'updates': {
      'url': 'https://u.expo.dev/d334ba17-8f78-4e6e-aa0e-2c8d3028fd3e'
    },
    'extra': {
      'env': envVars,
      'version': moment.utc().format('YYYYMMDD-HHmm'),
      'eas': {
        'projectId': 'd334ba17-8f78-4e6e-aa0e-2c8d3028fd3e'
      }
    }
  };

};
