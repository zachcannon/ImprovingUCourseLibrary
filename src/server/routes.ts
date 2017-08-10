import * as express from "express";
import * as path from "path";
import { Configuration } from "./configuration";

export function configureRoutes(app: express.Express, authenticate: express.Handler, config: Configuration) {
    app.get("/js/app/config.js", (req, res, next) => {
        var secure =
            (typeof process.env.JINAGA_SECURE !== 'undefined') ?
                (process.env.JINAGA_SECURE === 'true') :
                config.secure;
        res.send(
            "var distributorUrl = \"" + (secure ? "wss" : "ws") + "://" + req.headers.host + "/\";\n" +
            "var loginUrl = \"" + (secure ? "https" : "http") + "://" + req.headers.host + "/login\";\n");
        res.end();
    });

    app.use("/bower_components", express.static(path.join(__dirname, "bower_components")));
    app.use("/public", express.static(path.join(__dirname, "public")));
    app.use("/private", express.static(path.join(__dirname, "private")));

    app.get("/courses", authenticate, (req, res, next) => {
        res.render("current/courses");
    });
    
    app.get("/ideas", authenticate, (req, res, next) => {
        res.render("current/ideas");
    });

    app.get("/calendar", authenticate, (req, res, next) => {
        res.render("current/calendar");
    });

    app.get("/courses/prior", authenticate, (req, res, next) => {
        res.render("prior/courses");
    });
    
    app.get("/", (req, res, next) => {
        res.render("index");
    });
}