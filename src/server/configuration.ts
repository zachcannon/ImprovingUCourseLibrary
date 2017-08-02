export class Google {
    public clientId: string;
    public clientSecret: string;
    public loginUrl: string;
    public redirectUrl: string;
}

export class AD {
    public realm: string;
    public loginUrl: string;
    public redirectUrl: string;
    public logoutUrl: string;
    public identityProviderUrl: string;
    public identityMetadata: string;
}

export class Configuration {
    public port: number;
    public baseUrl: string;
    public sessionSecret: string;
    public mongoDB: string;
    public secure: boolean;
    public google?: Google;
    public ad?: AD;
}

export function loadConfiguration(): Configuration {
    try {
        return require("./config/config").makeConfiguration();
    }
    catch (err) {
        return {
            port: 3000,
            baseUrl: "http://localhost:3000",
            sessionSecret: "tacocat",
            mongoDB: "mongodb://localhost:27017/dev",
            secure: false,
            ad: {
                realm: 'http://localhost:3000',
                loginUrl: '/login',
                redirectUrl: '/login/callback',
                logoutUrl: '/logout',
                identityProviderUrl: '',
                identityMetadata: ''
            }
        };
    }
}
