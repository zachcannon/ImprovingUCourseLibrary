import { Configuration } from "../configuration"

export function makeConfiguration() : Configuration {
    return {
        port: 3000,
        baseUrl: "http://localhost:3000",
        sessionSecret: "tacocat",
        mongoDB: 'mongodb://localhost:27017/improvingu',
        secure: false,
        ad: {
            realm: 'http://localhost:3000',
            loginUrl: '/login',
            redirectUrl: '/login/callback',
            logoutUrl: '/logout',
            identityProviderUrl: null, // Please set AD_IDENTITY_PROVIDER_URL environment variable
            identityMetadata: null // Please set AD_IDENTITY_METADATA environment variable
        }
    };
}
