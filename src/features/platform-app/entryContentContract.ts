export const PLATFORM_APP_ENTRY_CAPABILITY_ID = "platform.app.entry-content" as const;
export const PLATFORM_APP_ENTRY_VERSION = 1 as const;
export const PLATFORM_APP_ENTRY_LOCALE = "pt-BR" as const;
export const PLATFORM_APP_ENTRY_PAGE = "app_entry" as const;
export const PLATFORM_APP_ENTRY_KEY = "content" as const;

export type PlatformAppEntryContent = {
  login: {
    submitLabel: string;
    recoverPasswordLabel: string;
    registrationPrompt: string;
    registrationActionLabel: string;
  };
  registration: {
    detailsTitle: string;
    fullNameHelper: string;
    detailsContinueLabel: string;
    passwordTitle: string;
    passwordDescription: string;
    passwordContinueLabel: string;
  };
  passwordRecovery: {
    title: string;
    description: string;
    continueLabel: string;
    backToLoginLabel: string;
  };
};

export type PlatformAppEntryPayloadV1 = {
  capabilityId: typeof PLATFORM_APP_ENTRY_CAPABILITY_ID;
  version: typeof PLATFORM_APP_ENTRY_VERSION;
  locale: typeof PLATFORM_APP_ENTRY_LOCALE;
  screens: Record<string, unknown> & PlatformAppEntryContent;
};

export const PLATFORM_APP_ENTRY_DEFAULTS: PlatformAppEntryContent = {
  login: {
    submitLabel: "Entrar",
    recoverPasswordLabel: "Esqueci minha senha",
    registrationPrompt: "Não tem uma conta?",
    registrationActionLabel: "Criar conta",
  },
  registration: {
    detailsTitle: "Seus dados",
    fullNameHelper: 'Ex.: Daniel, não "Dani"',
    detailsContinueLabel: "Continuar",
    passwordTitle: "Escolha sua senha",
    passwordDescription:
      "Defina uma senha de acesso à plataforma. Atente-se para os requisitos de uma senha segura.",
    passwordContinueLabel: "Continuar",
  },
  passwordRecovery: {
    title: "Recuperar senha",
    description: "Esqueceu a sua senha? Não se preocupe, vamos recuperá-la.",
    continueLabel: "Continuar",
    backToLoginLabel: "Ir para a Home",
  },
};

const FIELD_LIMITS = {
  submitLabel: 60,
  recoverPasswordLabel: 80,
  registrationPrompt: 100,
  registrationActionLabel: 60,
  detailsTitle: 80,
  fullNameHelper: 160,
  detailsContinueLabel: 60,
  passwordTitle: 80,
  passwordDescription: 320,
  passwordContinueLabel: 60,
  title: 80,
  description: 320,
  continueLabel: 60,
  backToLoginLabel: 80,
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const CONTROL_CHARACTERS = /[\p{Cc}\p{Cf}]/u;

function normalizeContentText(value: unknown, fallback: string, maxLength: number): string {
  if (typeof value !== "string" || /\r|\n/u.test(value) || CONTROL_CHARACTERS.test(value)) return fallback;

  const normalized = value.normalize("NFC").trim().replace(/\s+/gu, " ");
  if (!normalized || normalized.length > maxLength || /[<>]/u.test(normalized)) return fallback;
  if (/(?:\{\{[^{}]+\}\}|\$\{[^}]+\}|%[a-z_]+%)/iu.test(normalized)) return fallback;

  return normalized;
}

function normalizeScreen<T extends Record<string, string>>(
  input: unknown,
  defaults: T,
): T {
  const candidate = isRecord(input) ? input : {};
  const normalized = { ...defaults };

  for (const key of Object.keys(defaults) as Array<keyof T>) {
    normalized[key] = normalizeContentText(
      candidate[String(key)],
      defaults[key],
      FIELD_LIMITS[key as keyof typeof FIELD_LIMITS] ?? 160,
    ) as T[keyof T];
  }

  return normalized;
}

export function createDefaultPlatformAppEntryContent(): PlatformAppEntryContent {
  return {
    login: { ...PLATFORM_APP_ENTRY_DEFAULTS.login },
    registration: { ...PLATFORM_APP_ENTRY_DEFAULTS.registration },
    passwordRecovery: { ...PLATFORM_APP_ENTRY_DEFAULTS.passwordRecovery },
  };
}

export function parsePlatformAppEntryContent(input: unknown): PlatformAppEntryContent {
  if (
    !isRecord(input) ||
    input.capabilityId !== PLATFORM_APP_ENTRY_CAPABILITY_ID ||
    input.version !== PLATFORM_APP_ENTRY_VERSION ||
    input.locale !== PLATFORM_APP_ENTRY_LOCALE ||
    !isRecord(input.screens)
  ) {
    return createDefaultPlatformAppEntryContent();
  }

  return {
    login: normalizeScreen(input.screens.login, PLATFORM_APP_ENTRY_DEFAULTS.login),
    registration: normalizeScreen(
      input.screens.registration,
      PLATFORM_APP_ENTRY_DEFAULTS.registration,
    ),
    passwordRecovery: normalizeScreen(
      input.screens.passwordRecovery,
      PLATFORM_APP_ENTRY_DEFAULTS.passwordRecovery,
    ),
  };
}
