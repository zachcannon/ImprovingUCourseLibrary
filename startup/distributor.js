function chainMiddleware(err) {
    function compose(fn1) {
        return {
            then: function(fn2) {
                return compose(function (request, response, done) {
                    fn1(request, response, function (error) {
                        if (error) {
                            err(error);
                        }
                        else {
                            fn2(request, response, done);
                        }
                    });
                });
            },
            end: function() {
                return fn1;
            }
        };
    }

    return {
        first: compose
    }
}

module.exports = function( server, pipeline, authorization, config ) {
    var JinagaDistributor = require("jinaga/jinaga.distributor.server");
    var MongoProvider = require("jinaga/jinaga.mongo");
    var debug = require('debug')('improvingu');

    var mongo = new MongoProvider(config.mongoDB || "mongodb://localhost:27017/dev");

    function getUser(request, response, done) {
        if (request.isAuthenticated())
            done(request.user);
        else
            done(null);
    }

    function authenticateUser(request, done) {
        var handler = chainMiddleware(console.log)
            .first(pipeline.cookieParser)
            .then(pipeline.session)
            .then(authorization.initialize)
            .then(authorization.session)
            .then(getUser)
            .end();
        handler(request, {}, done);
    }

    JinagaDistributor.attach(mongo, mongo, server, authenticateUser);
};
