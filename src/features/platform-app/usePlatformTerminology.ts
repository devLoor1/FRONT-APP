import { useCallback, useMemo } from "react";
import { usePlatformSettings } from "./PlatformSettingsProvider";
import { getInvestorPlatformValue } from "./platformValue";
import {
  PLATFORM_TERMINOLOGY_KEY,
  PLATFORM_TERMINOLOGY_PAGE,
  parsePlatformTerminology,
  type PlatformTerminologyTokenId,
} from "./terminology";

export function usePlatformTerminology() {
  const platform = usePlatformSettings();
  const config = useMemo(
    () =>
      parsePlatformTerminology(
        getInvestorPlatformValue(
          platform.data,
          PLATFORM_TERMINOLOGY_PAGE,
          PLATFORM_TERMINOLOGY_KEY,
        ),
      ),
    [platform.data],
  );

  const resolveTerminology = useCallback(
    (tokenId: PlatformTerminologyTokenId, fallback: string) => config[tokenId] || fallback,
    [config],
  );

  return { resolveTerminology };
}
