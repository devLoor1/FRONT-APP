import { usePlatformSettings } from "./PlatformSettingsProvider";
import { getInvestorPlatformValue } from "./platformValue";

export function getPlatformFeatureFlag(
  platformResponse: unknown,
  key: string,
  fallback = false,
): boolean {
  const value = getInvestorPlatformValue(platformResponse, "features", key);
  return typeof value === "boolean" ? value : fallback;
}

export function usePlatformFeatureFlag(key: string, fallback = false): boolean {
  const { data } = usePlatformSettings();
  return getPlatformFeatureFlag(data, key, fallback);
}
