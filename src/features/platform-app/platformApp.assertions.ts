import { readFile } from "node:fs/promises";
import {
  PLATFORM_APP_ENTRY_DEFAULTS,
  parsePlatformAppEntryContent,
} from "./entryContentContract";
import { getInvestorPlatformValue } from "./platformValue";
import {
  PLATFORM_TERMINOLOGY_DEFAULTS,
  parsePlatformTerminology,
} from "./terminology";

let assertionCount = 0;

function assert(condition: unknown, message: string): asserts condition {
  assertionCount += 1;
  if (!condition) throw new Error(message);
}

const response = {
  data: {
    pages: {
      app_entry: {
        content: {
          capabilityId: "platform.app.entry-content",
          version: 1,
          locale: "pt-BR",
          screens: {
            login: { submitLabel: "Acessar" },
            registration: { detailsTitle: "Comece por aqui" },
            passwordRecovery: { title: "Redefina seu acesso" },
          },
        },
      },
    },
  },
};

const persisted = getInvestorPlatformValue(response, "app_entry", "content");
const content = parsePlatformAppEntryContent(persisted);
assert(content.login.submitLabel === "Acessar", "aplica conteúdo persistido de Login");
assert(content.registration.detailsTitle === "Comece por aqui", "aplica conteúdo de Cadastro");
assert(content.passwordRecovery.title === "Redefina seu acesso", "aplica conteúdo de Recuperação");
assert(
  content.login.registrationPrompt === PLATFORM_APP_ENTRY_DEFAULTS.login.registrationPrompt,
  "payload parcial completa defaults por campo",
);

for (const invalid of [
  undefined,
  {},
  { capabilityId: "other", version: 1, locale: "pt-BR", screens: {} },
  { capabilityId: "platform.app.entry-content", version: 2, locale: "pt-BR", screens: {} },
]) {
  assert(
    parsePlatformAppEntryContent(invalid).login.submitLabel === "Entrar",
    "envelope incompatível usa fallback",
  );
}

const invalidFields = parsePlatformAppEntryContent({
  capabilityId: "platform.app.entry-content",
  version: 1,
  locale: "pt-BR",
  screens: {
    login: { submitLabel: "<b>Acessar</b>", recoverPasswordLabel: "Recuperar\nsenha" },
    registration: { detailsTitle: "Cadastro válido" },
    passwordRecovery: { title: "{{token}}" },
  },
});
assert(invalidFields.login.submitLabel === "Entrar", "HTML usa fallback por campo");
assert(invalidFields.login.recoverPasswordLabel === "Esqueci minha senha", "quebra de linha usa fallback");
assert(invalidFields.passwordRecovery.title === "Recuperar senha", "placeholder usa fallback");
assert(invalidFields.registration.detailsTitle === "Cadastro válido", "texto válido é preservado");

const terminology = parsePlatformTerminology({
  capabilityId: "platform.terminology",
  version: 1,
  locale: "pt-BR",
  values: {
    "investmentOffering.label.singular": "Oferta",
    "investmentOffering.label.plural": "Ofertas",
    "investorRole.label.plural": "Pessoas investidoras",
  },
});
assert(terminology["investmentOffering.label.singular"] === "Oferta", "terminologia singular compartilhada");
assert(terminology["investmentOffering.label.plural"] === "Ofertas", "terminologia plural compartilhada");
assert(terminology["investorRole.label.plural"] === "Pessoas investidoras", "papel plural compartilhado");
assert(
  terminology["investmentPortfolio.label.singular"] === PLATFORM_TERMINOLOGY_DEFAULTS["investmentPortfolio.label.singular"],
  "token sem valor usa default canônico",
);
assert(
  parsePlatformTerminology({
    capabilityId: "platform.terminology",
    version: 1,
    locale: "pt-BR",
    values: { "investmentOffering.label.plural": "<b>Ofertas</b>" },
  })["investmentOffering.label.plural"] === "Oportunidades",
  "termo inválido usa fallback canônico",
);

const appSource = await readFile(new URL("../../App.tsx", import.meta.url), "utf8");
const featureFiles = await Promise.all(
  [
    "./platformSettings.ts",
    "./platformValue.ts",
    "./PlatformSettingsProvider.tsx",
    "./entryContentContract.ts",
    "./usePlatformAppEntryContent.ts",
    "./terminology.ts",
    "./usePlatformTerminology.ts",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const featureSource = featureFiles.join("\n");
const consumerFiles = await Promise.all(
  [
    "../../pages/private/Opportunities/index.tsx",
    "../../pages/private/OpportunitiesDetail/index.tsx",
    "../../pages/private/Wallet/components/navbar/index.tsx",
    "../../pages/private/Invest/index.tsx",
    "../../pages/private/Invest/tabs/FinishTab/index.tsx",
    "../../pages/private/OpportunitiesDetail/components/GeneralInfos/index.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const consumerSource = consumerFiles.join("\n");
const authConsumerFiles = await Promise.all(
  [
    "../../pages/public/Login/components/LoginContent/index.tsx",
    "../../pages/public/PreRegister/pages/RegisterData/index.tsx",
    "../../pages/public/PreRegister/pages/Password/index.tsx",
    "../../pages/public/Forget/components/GeneralPage/index.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const operationalCompletionFiles = await Promise.all(
  [
    "../../pages/public/PreRegister/pages/Success/index.tsx",
    "../../pages/public/Forget/components/Confirmation/index.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
assert(appSource.includes("PlatformSettingsProvider"), "App usa provider compartilhado");
assert(featureSource.includes('"/investor/platform"'), "usa endpoint genérico existente");
assert(!/AsyncStorage|SecureStore|redux-persist/u.test(featureSource), "configuração não cria storage paralelo");
assert(!/image|upload|assetId|backgroundImage/iu.test(featureSource), "contrato V1 não inclui mídia");
assert(consumerSource.includes("investmentOffering.label.singular"), "singular de Oportunidade possui consumer isolado");
assert(consumerSource.includes("investmentOffering.label.plural"), "plural de Oportunidade possui consumers isolados");
assert(consumerSource.includes("investorRole.label.plural"), "plural de Investidor possui consumer isolado");
assert(!consumerSource.includes("investmentPortfolio.label.singular"), "Carteira singular não recebe interpolação artificial");
assert(!consumerSource.includes("investmentPortfolio.label.plural"), "Carteira plural permanece sem consumer no App");
assert(!consumerSource.includes("investorRole.label.singular"), "Investidor singular permanece sem consumer no App");
assert(authConsumerFiles.every((source) => source.includes("usePlatformAppEntryContent")), "quatro superfícies editoriais consomem a família de entrada");
assert(operationalCompletionFiles.every((source) => !source.includes("usePlatformAppEntryContent")), "mensagens operacionais de conclusão permanecem fora da configuração");

console.log(`platformApp: ${assertionCount} assertions passed`);
