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
import {
  PLATFORM_APP_AUTHENTICATED_DEFAULTS,
  parsePlatformAppAuthenticatedContent,
} from "./authenticatedContentContract";

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
            completeRegistration: { personalDataTitle: "Complete seus dados" },
          },
        },
      },
      app_authenticated: {
        content: {
          capabilityId: "platform.app.authenticated-content",
          version: 1,
          locale: "pt-BR",
          screens: {
            wallet: { availableOpportunitiesTitle: "Seleção em destaque" },
            opportunities: { searchPlaceholder: "Buscar ofertas" },
            investments: { emptyStateHelper: "Revise sua busca." },
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
  content.completeRegistration.personalDataTitle === "Complete seus dados",
  "aplica conteúdo de Completar cadastro",
);
assert(
  content.login.registrationPrompt === PLATFORM_APP_ENTRY_DEFAULTS.login.registrationPrompt,
  "payload parcial completa defaults por campo",
);
assert(
  content.completeRegistration.addressTitle ===
    PLATFORM_APP_ENTRY_DEFAULTS.completeRegistration.addressTitle,
  "Completar cadastro parcial usa fallback por campo",
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
    completeRegistration: { annualIncomeHelper: "<b>Renda</b>" },
  },
});
assert(invalidFields.login.submitLabel === "Entrar", "HTML usa fallback por campo");
assert(invalidFields.login.recoverPasswordLabel === "Esqueci minha senha", "quebra de linha usa fallback");
assert(invalidFields.passwordRecovery.title === "Recuperar senha", "placeholder usa fallback");
assert(invalidFields.registration.detailsTitle === "Cadastro válido", "texto válido é preservado");
assert(
  invalidFields.completeRegistration.annualIncomeHelper ===
    PLATFORM_APP_ENTRY_DEFAULTS.completeRegistration.annualIncomeHelper,
  "campo inválido de Completar cadastro usa fallback",
);

const authenticated = parsePlatformAppAuthenticatedContent(
  getInvestorPlatformValue(response, "app_authenticated", "content"),
);
assert(
  authenticated.wallet.availableOpportunitiesTitle === "Seleção em destaque",
  "aplica conteúdo persistido da Carteira",
);
assert(
  authenticated.opportunities.searchPlaceholder === "Buscar ofertas",
  "aplica conteúdo persistido de Oportunidades",
);
assert(
  authenticated.investments.emptyStateHelper === "Revise sua busca.",
  "aplica conteúdo persistido de Investimentos",
);
assert(
  authenticated.wallet.investedOpportunitiesTitle ===
    PLATFORM_APP_AUTHENTICATED_DEFAULTS.wallet.investedOpportunitiesTitle,
  "payload autenticado parcial completa defaults por campo",
);
assert(
  parsePlatformAppAuthenticatedContent({
    capabilityId: "platform.app.authenticated-content",
    version: 2,
    locale: "pt-BR",
    screens: {},
  }).opportunities.searchPlaceholder === "Pesquisar",
  "envelope autenticado incompatível usa fallback",
);
assert(
  parsePlatformAppAuthenticatedContent({
    capabilityId: "platform.app.authenticated-content",
    version: 1,
    locale: "pt-BR",
    screens: { investments: { emptyStateHelper: "<b>Sem itens</b>" } },
  }).investments.emptyStateHelper ===
    PLATFORM_APP_AUTHENTICATED_DEFAULTS.investments.emptyStateHelper,
  "campo autenticado inválido usa fallback",
);

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
    "./authenticatedContentContract.ts",
    "./usePlatformAppAuthenticatedContent.ts",
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
    "../../pages/private/Wallet/index.tsx",
    "../../pages/private/Investments/index.tsx",
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
const completeRegistrationConsumerFiles = await Promise.all(
  [
    "../../pages/private/Register/pages/PersonalDataOne/index.tsx",
    "../../pages/private/Register/pages/PersonalDataTwo/index.tsx",
    "../../pages/private/Register/pages/Address/index.tsx",
    "../../pages/private/Register/pages/BankData/index.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const protectedCompleteRegistrationFiles = await Promise.all(
  [
    "../../pages/private/Register/pages/Proof/index.tsx",
    "../../pages/private/Register/pages/Proof/components/Success/index.tsx",
    "../../pages/private/Register/pages/Success/index.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
const routesSource = await readFile(new URL("../../routes/index.tsx", import.meta.url), "utf8");
assert(appSource.includes("PlatformSettingsProvider"), "App usa provider compartilhado");
assert(featureSource.includes('"/investor/platform"'), "usa endpoint genérico existente");
assert(!/AsyncStorage|SecureStore|redux-persist/u.test(featureSource), "configuração não cria storage paralelo");
assert(!/image|upload|assetId|backgroundImage/iu.test(featureSource), "contrato V1 não inclui mídia");
assert(consumerSource.includes("investmentOffering.label.singular"), "singular de Oportunidade possui consumer isolado");
assert(consumerSource.includes("investmentOffering.label.plural"), "plural de Oportunidade possui consumers isolados");
assert(consumerSource.includes("investorRole.label.plural"), "plural de Investidor possui consumer isolado");
assert(consumerSource.includes("investmentPortfolio.label.singular"), "Carteira singular possui consumer natural na lista de investimentos");
assert(!consumerSource.includes("investmentPortfolio.label.plural"), "Carteira plural permanece sem consumer no App");
assert(!consumerSource.includes("investorRole.label.singular"), "Investidor singular permanece sem consumer no App");
assert(authConsumerFiles.every((source) => source.includes("usePlatformAppEntryContent")), "quatro superfícies editoriais consomem a família de entrada");
assert(operationalCompletionFiles.every((source) => !source.includes("usePlatformAppEntryContent")), "mensagens operacionais de conclusão permanecem fora da configuração");
assert(
  completeRegistrationConsumerFiles.every((source) => source.includes("usePlatformAppEntryContent")),
  "quatro etapas editoriais de Completar cadastro consomem a família de entrada",
);
assert(
  protectedCompleteRegistrationFiles.every((source) => !source.includes("usePlatformAppEntryContent")),
  "prova, Face Match e sucesso permanecem operacionais",
);
assert(routesSource.includes('firstPage="Register"'), "conta waiting entra na rota privada Register");
assert(
  completeRegistrationConsumerFiles[2].includes("Declaro para fins de comprovação de residência"),
  "declaração legal permanece fixa no consumer",
);
assert(!featureSource.includes("addressDeclaration"), "declaração legal não entra no contrato");
assert(consumerSource.includes("usePlatformAppAuthenticatedContent"), "superfícies autenticadas consomem o resolver compartilhado");

const opportunitiesSource = consumerFiles[0];
const investmentsSource = consumerFiles[4];
const opportunityDetailsSource = consumerFiles[7];
assert(opportunitiesSource.includes("Nenhuma oportunidade encontrada"), "estado operacional vazio de Oportunidades permanece fixo");
assert(investmentsSource.includes("Nenhum investimento encontrado"), "estado operacional vazio de Investimentos permanece fixo");
assert(opportunityDetailsSource.includes("content.detailResourcesLabel"), "label de recursos possui consumer ativo");
assert(opportunityDetailsSource.includes("content.detailProfileLabel"), "label de perfil possui consumer ativo");
assert(!featureSource.includes("detailFundingReasonTitle"), "seção comentada de captação não entra no contrato");
assert(!featureSource.includes("detailSectorTitle"), "seção comentada de setor não entra no contrato");

const protectedInvestmentFlow = await Promise.all(
  [
    "../../pages/private/Invest/tabs/InvestmentTab/index.tsx",
    "../../pages/private/Invest/tabs/PersonalDataTab/index.tsx",
    "../../pages/private/Invest/tabs/Summary/index.tsx",
    "../../pages/private/Invest/tabs/Crowdfunding/index.tsx",
    "../../pages/private/Invest/components/Success/index.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
);
assert(
  protectedInvestmentFlow.every((source) => !source.includes("usePlatformAppAuthenticatedContent")),
  "Pix, dados pessoais, declaração, resumo e sucesso permanecem operacionais",
);

console.log(`platformApp: ${assertionCount} assertions passed`);
