export const PLATFORM_APP_AUTHENTICATED_CAPABILITY_ID =
  "platform.app.authenticated-content" as const;
export const PLATFORM_APP_AUTHENTICATED_VERSION = 1 as const;
export const PLATFORM_APP_AUTHENTICATED_LOCALE = "pt-BR" as const;
export const PLATFORM_APP_AUTHENTICATED_PAGE = "app_authenticated" as const;
export const PLATFORM_APP_AUTHENTICATED_KEY = "content" as const;

export type PlatformAppAuthenticatedContent = {
  wallet: {
    investedOpportunitiesTitle: string;
    availableOpportunitiesTitle: string;
    availableOpportunitiesMoreLabel: string;
    availableOpportunitiesInfoTitle: string;
    availableOpportunitiesInfoDescription: string;
  };
  opportunities: {
    searchPlaceholder: string;
    emptyStateHelper: string;
    detailProgressTitle: string;
    detailResourcesLabel: string;
    detailProfileLabel: string;
    detailTeamTitle: string;
  };
  investments: {
    searchPlaceholder: string;
    emptyStateHelper: string;
  };
};

export type PlatformAppAuthenticatedPayloadV1 = {
  capabilityId: typeof PLATFORM_APP_AUTHENTICATED_CAPABILITY_ID;
  version: typeof PLATFORM_APP_AUTHENTICATED_VERSION;
  locale: typeof PLATFORM_APP_AUTHENTICATED_LOCALE;
  screens: Record<string, unknown> & PlatformAppAuthenticatedContent;
};

export const PLATFORM_APP_AUTHENTICATED_DEFAULTS: PlatformAppAuthenticatedContent = {
  wallet: {
    investedOpportunitiesTitle: "Oportunidades investidas",
    availableOpportunitiesTitle: "Oportunidades disponíveis",
    availableOpportunitiesMoreLabel: "veja mais",
    availableOpportunitiesInfoTitle: "Novas oportunidades",
    availableOpportunitiesInfoDescription:
      "Apresenta o valor total investido, detalhando todos os custos envolvidos.",
  },
  opportunities: {
    searchPlaceholder: "Pesquisar",
    emptyStateHelper: "Ajuste sua busca ou os filtros para tentar novamente.",
    detailProgressTitle: "Progresso",
    detailResourcesLabel: "Aplicação dos recursos",
    detailProfileLabel: "Perfil",
    detailTeamTitle: "Equipe",
  },
  investments: {
    searchPlaceholder: "Pesquisar",
    emptyStateHelper: "Ajuste sua busca ou os filtros para tentar novamente.",
  },
};

const FIELD_LIMITS = {
  investedOpportunitiesTitle: 100,
  availableOpportunitiesTitle: 100,
  availableOpportunitiesMoreLabel: 60,
  availableOpportunitiesInfoTitle: 100,
  availableOpportunitiesInfoDescription: 280,
  searchPlaceholder: 80,
  emptyStateHelper: 180,
  detailProgressTitle: 80,
  detailResourcesLabel: 100,
  detailProfileLabel: 80,
  detailTeamTitle: 80,
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const CONTROL_CHARACTERS = /[\p{Cc}\p{Cf}]/u;

function normalizeContentText(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== "string" || /\r|\n/u.test(value) || CONTROL_CHARACTERS.test(value)) {
    return fallback;
  }

  const normalized = value.normalize("NFC").trim().replace(/\s+/gu, " ");
  if (!normalized || normalized.length > maxLength || /[<>]/u.test(normalized)) return fallback;
  if (/(?:\{\{[^{}]+\}\}|\$\{[^}]+\}|%[a-z_]+%)/iu.test(normalized)) return fallback;

  return normalized;
}

function normalizeScreen<T extends Record<string, string>>(input: unknown, defaults: T): T {
  const candidate = isRecord(input) ? input : {};
  const normalized = { ...defaults };

  for (const key of Object.keys(defaults) as Array<keyof T>) {
    normalized[key] = normalizeContentText(
      candidate[String(key)],
      defaults[key],
      FIELD_LIMITS[key as keyof typeof FIELD_LIMITS] ?? 180,
    ) as T[keyof T];
  }

  return normalized;
}

export function createDefaultPlatformAppAuthenticatedContent(): PlatformAppAuthenticatedContent {
  return {
    wallet: { ...PLATFORM_APP_AUTHENTICATED_DEFAULTS.wallet },
    opportunities: { ...PLATFORM_APP_AUTHENTICATED_DEFAULTS.opportunities },
    investments: { ...PLATFORM_APP_AUTHENTICATED_DEFAULTS.investments },
  };
}

export function parsePlatformAppAuthenticatedContent(
  input: unknown,
): PlatformAppAuthenticatedContent {
  if (
    !isRecord(input) ||
    input.capabilityId !== PLATFORM_APP_AUTHENTICATED_CAPABILITY_ID ||
    input.version !== PLATFORM_APP_AUTHENTICATED_VERSION ||
    input.locale !== PLATFORM_APP_AUTHENTICATED_LOCALE ||
    !isRecord(input.screens)
  ) {
    return createDefaultPlatformAppAuthenticatedContent();
  }

  return {
    wallet: normalizeScreen(input.screens.wallet, PLATFORM_APP_AUTHENTICATED_DEFAULTS.wallet),
    opportunities: normalizeScreen(
      input.screens.opportunities,
      PLATFORM_APP_AUTHENTICATED_DEFAULTS.opportunities,
    ),
    investments: normalizeScreen(
      input.screens.investments,
      PLATFORM_APP_AUTHENTICATED_DEFAULTS.investments,
    ),
  };
}
