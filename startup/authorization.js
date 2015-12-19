var passport = require('passport');
var AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2').Strategy;
var jwt = require('jsonwebtoken');

module.exports = function( app, config ) {
    passport.use(
        new AzureAdOAuth2Strategy({
            tenant: config.azureAd.tenant,
            clientID: config.azureAd.clientID,
            clientSecret: config.azureAd.clientSecret,
            callbackUrl: config.baseUrl + '/auth/azureadoauth2/callback',
            resource: '00000002-0000-0000-c000-000000000000'
        },
        function (accessToken, refresh_token, params, profile, done) {
            var waadProfile = profile || jwt.decode(params.id_token);
            if (waadProfile && waadProfile.upn) {
                return done(null, {
                    provider: waadProfile.provider,
                    id: waadProfile.upn,
                    profile: {
                        displayName: waadProfile.displayName
                    }
                });
            }
            else {
                return done(null, false, {
                    message: "Login failed"
                });
            }
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

    app.get('/auth/azureadoauth2', passport.authenticate('azure_ad_oauth2'));

    app.get('/auth/azureadoauth2/callback', passport.authenticate('azure_ad_oauth2', {
            failureRedirect: '/public/login.html'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        }
    );

    return {
        initialize: doPassportInitialize,
        session: doPassportSession,
        require: function requireAuth(req, res, next) {
            if (req.isAuthenticated()) {
               return next();
            }
            return res.redirect('/public/login.html');
        }
    }
};
