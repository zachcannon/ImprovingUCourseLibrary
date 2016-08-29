var passport = require('passport');
var WsfedStrategy = require('passport-azure-ad').WsfedStrategy;
var debug = require('debug')('improvingu');

module.exports = function( app, config ) {
    var ad = config.ad || {};
    passport.use(new WsfedStrategy({
            realm: process.env.AD_REALM || ad.realm,
            logoutUrl: process.env.AD_LOGOUT_URL || ad.logoutUrl,
            identityProviderUrl: process.env.AD_IDENTITY_PROVIDER_URL || ad.identityProviderUrl,
            identityMetadata: process.env.AD_IDENTITY_METADATA || ad.identityMetadata
        },
        function (profile, done) {
            debug("Logged in: " + JSON.stringify(profile));
            return done(null, {
                provider: profile.provider,
                id: profile.id,
                profile: {
                    displayName: profile["http://schemas.microsoft.com/identity/claims/displayname"]
                }
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function(str, done) {
        done(null, JSON.parse(str));
    });

    var doPassportInitialize = passport.initialize();
    var doPassportSession = passport.session();
    app.use(doPassportInitialize);
    app.use(doPassportSession);

    var authenticate = passport.authenticate('wsfed-saml2', {
        failureRedirect: '/public/login.html'
    });
    function authenticationCallback(req, res) {
        var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
        delete req.session.redirect_to;
        res.redirect( redirect_to );
    }
    app.get('/login', authenticate);
    app.post('/login/callback', authenticate, authenticationCallback);

    return {
        initialize: doPassportInitialize,
        session: doPassportSession,
        require: function requireAuth(req, res, next) {
            if (req.isAuthenticated()) {
               return next();
            }
            req.session.redirect_to = req.originalUrl;
            return res.redirect('/public/login.html');
        }
    }
};
