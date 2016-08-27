var passport = require('passport');
var WsfedStrategy = require('passport-azure-ad').WsfedStrategy;
var LocalStrategy = require('passport-local').Strategy;
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
    var users = [
        { id: 1, username: 'mperry', password: 'password', displayName: 'Michael L Perry' },
        { id: 2, username: 'jperry', password: 'password', displayName: 'Jenny Perry' }
    ];
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var user = users.find(function (u) {
                return u.username === username && u.password === password;
            });
            if (user) {
                return done(null, {
                    provider: "local",
                    id: user.id,
                    profile: {
                        displayName: user.displayName
                    }
                });
            }
            else {
                return done(null, false, {
                    message: "Login failed"
                });
            }
        }
    ));

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
    app.post("/loginLocal", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/loginLocal"
    }));

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
