import React, { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getInvestorPlatformSettings,
} from "./platformSettings";
import type { InvestorPlatformResponse } from "./platformValue";

type PlatformSettingsContextValue = {
  data?: InvestorPlatformResponse;
  loading: boolean;
  unavailable: boolean;
  refresh: () => Promise<unknown>;
};

const PlatformSettingsContext = createContext<PlatformSettingsContextValue>({
  data: undefined,
  loading: true,
  unavailable: false,
  refresh: async () => undefined,
});

export function PlatformSettingsProvider({ children }: { readonly children: ReactNode }) {
  const query = useQuery({
    queryKey: ["investor-platform-settings"],
    queryFn: getInvestorPlatformSettings,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const value = useMemo<PlatformSettingsContextValue>(
    () => ({
      data: query.data,
      loading: query.isLoading,
      unavailable: query.isError,
      refresh: query.refetch,
    }),
    [query.data, query.isError, query.isLoading, query.refetch],
  );

  return (
    <PlatformSettingsContext.Provider value={value}>
      {children}
    </PlatformSettingsContext.Provider>
  );
}

export function usePlatformSettings() {
  return useContext(PlatformSettingsContext);
}
