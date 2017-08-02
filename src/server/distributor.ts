import { RequestHandler, Request, Response, NextFunction } from "express";
import { Server } from "http";
import JinagaDistributor = require("jinaga/jinaga.distributor.server");
import MongoProvider = require("jinaga/jinaga.mongo");
import chain = require("chain-middleware");
import { Authorization } from "./authorization";
import { Configuration } from "./configuration";

export function configureDistributor(
    server: Server,
    sessionHandler: RequestHandler,
    authorization: Authorization,
    config: Configuration) {

    var mongo = new MongoProvider(process.env.MONGO_DB || config.mongoDB || "mongodb://localhost:27017/dev");

    function getUser(request: Request, response: Response, done: NextFunction) {
        if (request.isAuthenticated())
            done(request.user);
        else
            done(null);
    }

    function authenticateUser(request: Request, done: NextFunction) {
        const handler = chain(
            sessionHandler,
            authorization.initialize,
            authorization.session,
            getUser);
        const response : Response = <Response>{};
        handler(request, response, done);
    }

    JinagaDistributor.attach(mongo, mongo, server, authenticateUser);
}