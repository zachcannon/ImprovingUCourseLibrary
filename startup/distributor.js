module.exports = function( server, pipeline, authorization, config ) {
    var JinagaDistributor = require("jinaga/jinaga.distributor.server");
    var MongoProvider = require("jinaga/jinaga.mongo");
    var chain = require("chain-middleware");

    var mongo = new MongoProvider(process.env.MONGO_DB || config.mongoDB || "mongodb://localhost:27017/dev");

    function getUser(request, response, done) {
        if (request.isAuthenticated())
            done(request.user);
        else
            done(null);
    }

    function authenticateUser(request, done) {
        var handler = chain(
            pipeline.cookieParser,
            pipeline.session,
            authorization.initialize,
            authorization.session,
            getUser);
        handler(request, {}, done);
    }

    JinagaDistributor.attach(mongo, mongo, server, authenticateUser);
};
