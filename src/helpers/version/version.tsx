import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export default function Version(): string {
  return [
    Updates.channel,
    Constants.expoConfig?.extra?.env?.env,
    Constants.expoConfig?.extra?.version,
  ].join(' - ');
}
