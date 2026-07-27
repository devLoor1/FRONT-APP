const REDACTED = "[REDACTED]";
const TRUNCATED = "[TRUNCATED]";
const MAX_DEPTH = 3;
const MAX_ARRAY_ITEMS = 10;
const MAX_OBJECT_KEYS = 30;
const MAX_STRING_LENGTH = 512;

const SENSITIVE_KEYS = new Set([
  "access_token",
  "accesstoken",
  "address",
  "authorization",
  "birth_date",
  "birthdate",
  "cellphone",
  "cep",
  "cnpj",
  "confirmation_password",
  "confirmpassword",
  "cookie",
  "cookies",
  "cpf",
  "document",
  "email",
  "expo_push_token",
  "expopushtoken",
  "full_name",
  "fullname",
  "identity",
  "image",
  "mfa_code",
  "mfacode",
  "name",
  "otp",
  "password",
  "phone",
  "photo",
  "pix",
  "push_token",
  "pushtoken",
  "refresh_token",
  "refreshtoken",
  "rg",
  "secret",
  "selfie",
  "senha",
  "token",
  "uri",
  "verification_code",
  "verificationcode",
  "whatsapp",
]);

function normalizeKey(key: string) {
  return key.replace(/[^a-z0-9_]/gi, "").toLowerCase();
}

function isSensitiveKey(key: string) {
  const normalized = normalizeKey(key);
  return (
    SENSITIVE_KEYS.has(normalized) ||
    normalized.endsWith("token") ||
    normalized.endsWith("password") ||
    normalized.endsWith("secret")
  );
}

export function sanitizeText(value: string) {
  const sanitized = value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/gi, `Bearer ${REDACTED}`)
    .replace(
      /\b[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
      REDACTED
    )
    .replace(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
      REDACTED
    )
    .replace(/\b[A-Za-z0-9_+/=-]{32,}\b/g, REDACTED)
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, REDACTED)
    .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, REDACTED)
    .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, REDACTED)
    .replace(
      /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9?\d{4})[-\s]?\d{4}\b/g,
      REDACTED
    )
    .replace(/\b\d{5}-?\d{3}\b/g, REDACTED);

  if (sanitized.length <= MAX_STRING_LENGTH) return sanitized;
  return `${sanitized.slice(0, MAX_STRING_LENGTH)}...${TRUNCATED}`;
}

export function sanitizeEndpoint(value?: string) {
  if (!value) return undefined;

  try {
    const parsed = new URL(value);
    return sanitizeText(parsed.pathname);
  } catch {
    return sanitizeText(value.split(/[?#]/, 1)[0]);
  }
}

export function sanitizeTelemetryData(
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>()
): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return sanitizeText(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "function" || typeof value === "symbol") {
    return undefined;
  }
  if (depth >= MAX_DEPTH) return TRUNCATED;

  if (value instanceof Error) {
    return getSafeErrorContext(value);
  }

  if (value instanceof Date) return value.toISOString();
  if (typeof value !== "object") return sanitizeText(String(value));
  if (seen.has(value)) return "[CIRCULAR]";

  seen.add(value);

  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ARRAY_ITEMS)
      .map((item) => sanitizeTelemetryData(item, depth + 1, seen));
  }

  const constructorName = value.constructor?.name;
  if (
    constructorName === "Blob" ||
    constructorName === "File" ||
    constructorName === "FormData"
  ) {
    return "[BINARY]";
  }

  const result: Record<string, unknown> = {};
  const entries = Object.entries(value).slice(0, MAX_OBJECT_KEYS);

  for (const [key, item] of entries) {
    result[key] = isSensitiveKey(key)
      ? REDACTED
      : sanitizeTelemetryData(item, depth + 1, seen);
  }

  return result;
}

export function sanitizeTelemetryRecord(value: unknown) {
  const sanitized = sanitizeTelemetryData(value);
  if (!sanitized || typeof sanitized !== "object" || Array.isArray(sanitized)) {
    return {};
  }
  return sanitized as Record<string, unknown>;
}

export function getSafeErrorContext(error: unknown) {
  if (typeof error === "string") {
    return { message: sanitizeText(error) };
  }

  if (!error || typeof error !== "object") {
    return { message: "Unexpected error" };
  }

  const candidate = error as {
    name?: string;
    message?: string;
    code?: string;
    status?: number;
    method?: string;
    endpoint?: string;
    response?: { status?: number };
    config?: { method?: string; url?: string };
  };

  return {
    name: candidate.name ? sanitizeText(candidate.name) : "Error",
    message: candidate.message
      ? sanitizeText(candidate.message)
      : "Unexpected error",
    code: candidate.code ? sanitizeText(candidate.code) : undefined,
    status: candidate.status ?? candidate.response?.status,
    method: (candidate.method ?? candidate.config?.method)?.toUpperCase(),
    endpoint: candidate.endpoint
      ? sanitizeEndpoint(candidate.endpoint)
      : sanitizeEndpoint(candidate.config?.url),
  };
}

function log(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  context?: unknown
) {
  if (!__DEV__) return;

  if (context === undefined) {
    console[level](sanitizeText(message));
    return;
  }

  const safeContext =
    level === "error"
      ? getSafeErrorContext(context)
      : sanitizeTelemetryData(context);
  console[level](sanitizeText(message), safeContext);
}

export const safeLogger = {
  debug: (message: string, context?: unknown) =>
    log("debug", message, context),
  info: (message: string, context?: unknown) => log("info", message, context),
  warn: (message: string, context?: unknown) => log("warn", message, context),
  error: (message: string, context?: unknown) =>
    log("error", message, context),
};
