import * as Express from 'express';
import * as Passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { WsfedStrategy } from 'passport-azure-ad';
import { Configuration, Google, AD } from './configuration';

export class Authorization {
    public initialize: Express.Handler;
    public session: Express.Handler;
    public authenticate: Express.Handler;
}

export function configureAuthorization(app: Express.Express, config: Configuration) : Authorization {
    const baseUrl = process.env.BASE_URL || config.baseUrl;

    if (!baseUrl) {
        throw new Error('Please configure a base URL in config as baseUrl: \'http://localhost:8080\', or environment variable BASE_URL');
    }

    var strategy: Passport.Strategy,
        authenticateFunction: () => Express.Handler,
        loginUrl: string,
        redirectUrl: string,
        usePost: boolean;
    
    if (config.google) {
        strategy = createGoogleStrategy(config.google, baseUrl);
        authenticateFunction = authenticateGoogle;
        loginUrl = config.google.loginUrl || '/loginGoogle';
        redirectUrl = config.google.redirectUrl || '/loginGoogle/callback';
        usePost = false;
    }
    else if (config.ad) {
        strategy = createAdStrategy(config.ad, baseUrl);
        authenticateFunction = authenticateAd;
        loginUrl = config.ad.loginUrl || '/loginAd';
        redirectUrl = config.ad.redirectUrl || '/loginAd/callback';
        usePost = true;
    }
    else {
        throw new Error('Please configure either google or ad in config/config.js.');
    }

    Passport.use(strategy);

    Passport.serializeUser((user: Object, done) => {
        done(null, JSON.stringify(user));
    });

    Passport.deserializeUser((str: string, done) => {
        done(null, JSON.parse(str));
    });

    const doPassportInitialize = Passport.initialize();
    const doPassportSession = Passport.session();
    app.use(doPassportInitialize);
    app.use(doPassportSession);

    const authenticate = authenticateFunction();

    function authenticationCallback(req: Express.Request, res: Express.Response) {
        var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
        delete req.session.redirect_to;
        res.redirect( redirect_to );
    }
    app.get(loginUrl, authenticate);
    if (usePost) {
        app.post(redirectUrl, authenticate, authenticationCallback);
    }
    else {
        app.get(redirectUrl, authenticate, authenticationCallback);
    }

    return {
        initialize: doPassportInitialize,
        session: doPassportSession,
        authenticate: (req, res, next) => {
            if (req.isAuthenticated()) {
               return next();
            }
            req.session.redirect_to = req.originalUrl;
            return res.redirect(loginUrl);
        }
    }
}

function createGoogleStrategy(google: Google, baseUrl: string): Passport.Strategy {
    var clientId = process.env.GOOGLE_CLIENT_ID || google.clientId;
    var clientSecret = process.env.GOOGLE_CLIENT_SECRET || google.clientSecret;

    if (!clientId || !clientSecret) {
        throw new Error('Please configure Google client ID and secret in config as google { clientId: \'xxx\', clientSecret: \'yyy\' }, or environment variables GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
    }

    return new OAuth2Strategy({
            clientID: clientId,
            clientSecret: clientSecret,
            callbackURL: baseUrl + (google.redirectUrl || '/loginGoogle/callback')
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, {
                provider: profile.provider,
                id: profile.id,
                profile: {
                    displayName: profile.displayName
                }
            });
        }
    );
}

function authenticateGoogle(): Express.Handler {
    return Passport.authenticate('google', {
        failureRedirect: '/',
        scope: 'openid profile'
    });
}

function createAdStrategy(ad: AD, baseUrl: string): Passport.Strategy {
    var realm = process.env.AD_REALM || ad.realm;
    var logoutUrl = process.env.AD_LOGOUT_URL || ad.logoutUrl;
    var identityProviderUrl = process.env.AD_IDENTITY_PROVIDER_URL || ad.identityProviderUrl;
    var identityMetadata = process.env.AD_IDENTITY_METADATA || ad.identityMetadata;
    if (!realm || !logoutUrl || !identityProviderUrl || !identityMetadata) {
        throw new Error('Please configure AD realm, URLs, and metadata in config as ad { realm: \'http://mydomain\', logoutUrl: \'/logout\', ' +
            'identityProviderUrl: \'https://login.windows.net/my-tenant-id/wsfed\', identityMetadata: \'https://login.windows.net/my-tenant-id/federationmetadata/2007-06/federationmetadata.xml\' }, ' +
            'or environment variables AD_REALM, AD_LOGOUT_URL, AD_IDENTITY_PROVIDER_URL, and AD_IDENTITY_METADATA.');
    }
    
    return new WsfedStrategy({
            realm: realm,
            logoutUrl: baseUrl + logoutUrl,
            identityProviderUrl: identityProviderUrl,
            identityMetadata: identityMetadata
        },
        function (profile, done) {
            return done(null, {
                provider: profile.provider,
                id: profile.id,
                profile: {
                    displayName: profile["http://schemas.microsoft.com/identity/claims/displayname"]
                }
            });
        });
}

function authenticateAd() {
    return Passport.authenticate('wsfed-saml2', {
        failureRedirect: '/'
    });
}
