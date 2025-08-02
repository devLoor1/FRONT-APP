export interface Environment {
    base: {
        baseUrl_viacep: string;
        appStore: string;
        playStore: string;
    };
    DEV: EnvironmentConfig;
    PREVIEW: EnvironmentConfig;
    PROD: EnvironmentConfig;
}

export interface EnvironmentConfig {
    name: string;
    bundle: string;
    env: string;
    production: boolean;
    basicAuth: string;
    publicScopesAuth: string;
    publicGrantTypeAuth: string;
    baseUrl: string;
}

declare const environment: Environment;
export = environment;
