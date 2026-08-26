import { useMemo } from "react";
import {
  PLATFORM_APP_ENTRY_KEY,
  PLATFORM_APP_ENTRY_PAGE,
  parsePlatformAppEntryContent,
  type PlatformAppEntryContent,
} from "./entryContentContract";
import { usePlatformSettings } from "./PlatformSettingsProvider";
import { getInvestorPlatformValue } from "./platformValue";

export function usePlatformAppEntryContent(): PlatformAppEntryContent {
  const platform = usePlatformSettings();

  return useMemo(() => {
    const value = getInvestorPlatformValue(
      platform.data,
      PLATFORM_APP_ENTRY_PAGE,
      PLATFORM_APP_ENTRY_KEY,
    );
    return parsePlatformAppEntryContent(value);
  }, [platform.data]);
}
