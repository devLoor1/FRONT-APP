export type InvestorPlatformResponse = {
  data?: {
    slug?: string;
    pages?: Record<string, Record<string, unknown>>;
  };
};

export function getInvestorPlatformValue(
  response: unknown,
  page: string,
  key: string,
): unknown {
  if (!response || typeof response !== "object") return undefined;

  const data = (response as InvestorPlatformResponse).data;
  if (!data?.pages || typeof data.pages !== "object") return undefined;

  const pageSettings = data.pages[page];
  if (!pageSettings || typeof pageSettings !== "object") return undefined;

  return pageSettings[key];
}
