export const PLATFORM_TERMINOLOGY_PAGE = "terminology" as const;
export const PLATFORM_TERMINOLOGY_KEY = "config" as const;

export const PLATFORM_TERMINOLOGY_DEFAULTS = {
  "investmentPortfolio.label.singular": "Carteira",
  "investmentPortfolio.label.plural": "Carteiras",
  "investmentOffering.label.singular": "Oportunidade",
  "investmentOffering.label.plural": "Oportunidades",
  "investorRole.label.singular": "Investidor",
  "investorRole.label.plural": "Investidores",
} as const;

export type PlatformTerminologyTokenId = keyof typeof PLATFORM_TERMINOLOGY_DEFAULTS;
export type PlatformTerminologyConfig = Record<PlatformTerminologyTokenId, string>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const CONTROL_CHARACTERS = /[\p{Cc}\p{Cf}]/u;

function normalizeTerm(value: unknown, fallback: string): string {
  if (typeof value !== "string" || /\r|\n/u.test(value) || CONTROL_CHARACTERS.test(value)) return fallback;
  const normalized = value.normalize("NFC").trim().replace(/\s+/gu, " ");
  if (!normalized || Array.from(normalized).length > 40 || /[<>]/u.test(normalized)) return fallback;
  if (/[*_~`#>|\[\]]/u.test(normalized)) return fallback;
  if (/(?:\b[a-z][a-z0-9+.-]*:\/\/|\bwww\.|\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,})/iu.test(normalized)) return fallback;
  if (/(?:\$\{[^}]+\}|\{\{?[^{}]+\}?\}|%[a-z_]+%)/iu.test(normalized)) return fallback;
  if (/\p{Extended_Pictographic}/u.test(normalized)) return fallback;
  if (!/^[\p{L}\p{M}\p{N}\p{Zs} .,'’()&/+:-]+$/u.test(normalized)) return fallback;
  return normalized;
}

export function parsePlatformTerminology(input: unknown): PlatformTerminologyConfig {
  const defaults = { ...PLATFORM_TERMINOLOGY_DEFAULTS } as PlatformTerminologyConfig;

  if (
    !isRecord(input) ||
    input.capabilityId !== "platform.terminology" ||
    input.version !== 1 ||
    input.locale !== "pt-BR" ||
    !isRecord(input.values)
  ) {
    return defaults;
  }

  for (const tokenId of Object.keys(defaults) as PlatformTerminologyTokenId[]) {
    defaults[tokenId] = normalizeTerm(input.values[tokenId], defaults[tokenId]);
  }

  return defaults;
}
