import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as mongo from "connect-mongo";
import * as path from "path";
import * as http from "http";
import { loadConfiguration } from "./configuration";
import { configureAuthorization } from "./authorization";
import { configureDistributor } from "./distributor";
import { configureRoutes } from "./routes";

const app = express();
const server = http.createServer(app);
const config = loadConfiguration();
const MongoStore = mongo(session);

app.set("port", process.env.PORT || config.port);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

const sessionHandler = session({
    secret: process.env.SESSION_SECRET || config.sessionSecret || "randomCharacters",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({
        url: process.env.MONGO_DB || config.mongoDB || "mongodb://localhost:27017/dev",
        autoReconnect: true
    })
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(sessionHandler);

const authorization = configureAuthorization(app, config);
configureDistributor(server, sessionHandler, authorization, config);
configureRoutes(app, authorization.authenticate, config);

server.listen(app.get("port"), () => {
    console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  Press CTRL-C to stop\n");
});