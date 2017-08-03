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
            "var loginUrl = \"" + (secure ? "https" : "http") + "://" + req.headers.host + "/public/login.html\";\n");
        res.end();
    });

    app.use("/bower_components", express.static(path.join(__dirname, "../bower_components")));
    app.use("/public", express.static(path.join(__dirname, "../public")));
    app.use("/private", express.static(path.join(__dirname, "../private")));

    app.get("/courses", authenticate, (req, res, next) => {
        res.render("courses", {
            user: req.user.profile.displayName
        });
    });
    
    app.get("/ideas", (req, res, next) => {
        res.render("ideas");
    });
    
    app.get("/", (req, res, next) => {
        res.render("index");
    });
}