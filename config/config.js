module.exports = {
    baseUrl: 'http://localhost:3000',
    port: 3000,
    sessionSecret: 'secretString',
    ad: {
        realm: 'http://localhost:3000',
        loginUrl: '/login',
        redirectUrl: '/login/callback',
        logoutUrl: '/logout'
        //identityProviderUrl: 'Please set AD_IDENTITY_PROVIDER_URL environment variable',
        //identityMetadata: 'Please set AD_IDENTITY_METADATA environment variable'
    },
    mongoDB: 'mongodb://localhost:27017/improvingu',
    secure: false
};
