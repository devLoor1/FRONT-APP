import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { useUpdates } from "expo-updates";

export default function Version(): string {
  const { lastCheckForUpdateTimeSinceRestart } = useUpdates();
  
  return [
    Updates.channel,
    Updates.updateId?.substring(0, 8),
    Constants.expoConfig?.extra?.env?.env,
    Constants.expoConfig?.extra?.version,
  ].join(' - ');
}
