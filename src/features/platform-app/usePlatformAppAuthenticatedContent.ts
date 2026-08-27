import { useMemo } from "react";
import {
  PLATFORM_APP_AUTHENTICATED_KEY,
  PLATFORM_APP_AUTHENTICATED_PAGE,
  parsePlatformAppAuthenticatedContent,
  type PlatformAppAuthenticatedContent,
} from "./authenticatedContentContract";
import { usePlatformSettings } from "./PlatformSettingsProvider";
import { getInvestorPlatformValue } from "./platformValue";

export function usePlatformAppAuthenticatedContent(): PlatformAppAuthenticatedContent {
  const platform = usePlatformSettings();

  return useMemo(() => {
    const value = getInvestorPlatformValue(
      platform.data,
      PLATFORM_APP_AUTHENTICATED_PAGE,
      PLATFORM_APP_AUTHENTICATED_KEY,
    );
    return parsePlatformAppAuthenticatedContent(value);
  }, [platform.data]);
}
