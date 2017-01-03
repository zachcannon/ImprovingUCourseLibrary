module.exports = {
    baseUrl: 'http://localhost:8080',
    port: 8080,
    sessionSecret: 'secretString',
    ad: {
        realm: 'http://mysite.com',
        loginUrl: '/login',
        redirectUrl: '/login/callback',
        logoutUrl: '/logout',
        identityProviderUrl: 'https://login.windows.net/my-tenant-id/wsfed',
        identityMetadata: 'https://login.windows.net/my-tenant-id/federationmetadata/2007-06/federationmetadata.xml'
    },
    mongoDB: 'mongodb://localhost:27017/improvingu',
    secure: false
};
