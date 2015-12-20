# ImprovingU

Course survey site

## Background

ImprovingU is a series of courses taught by Improvers for Improvers (that is, people who work at [Improving](http://improving.com). This is a site created with [Jinaga](http://jinaga.com) to survey Improvers on courses they would like to take or teach.

## Requirements

* Node 5.0.0
* Mongo 3.0.0

## Installation

Clone the repository. Run `npm install`. Start a Mongo server on the local machine, or configure the application to use a different instance.

## Walkthrough

The application was created using these steps:

### Node

Create an empty directory and initialize a Node application using `npm init`. Also initialize a Git repository using `git init`.

Install Bower with `npm install -save bower`. Initialize it with `bower init` and select the "globals" package style.

### Express

Install Express with:

- `npm install -save express`
- `npm install -save body-parser`
- `npm install -save cookie-parser`
- `npm install -save express-session`

Create an `app.js` with the following code:

```JavaScript
var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {};
try {
    config = require('./config/config');
}
catch (err) {}

var app = express();
var server = http.createServer(app);
app.server = server;

var doCookieParser = cookieParser();
var doBodyParserUrlEncoded = bodyParser.urlencoded({extended: true});
var doSession = session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
});
app.use(doCookieParser);
app.use(doBodyParserUrlEncoded);
app.use(doSession);

app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(config.port || 8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('ImprovingU listening at http://%s:%s', host, port);
});
```

Create an HTML file in `public/index.html`. Run `node app` and browse to `http://localhost:8080` to test.

### Bootstrap

Install Bootstrap with `bower install -save bootstrap`. Copy a starting page to `public/index.html` and `public/style.css`, and modify the CSS and JS links:

```
<link href="/bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="/public/style.css" rel="stylesheet">
<script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
```

Test it by starting the app and refreshing the browser.

### Passport

Install Passport with `npm install -save passport`. Install your Passport provider. This app was built to work with Azure AD, so it used  `npm install -save passport-azure-ad`.

Create a file called `startup/authorization.js`. It should have the following structure:

```JavaScript
var passport = require('passport');

module.exports = function( app, config ) {
    passport.use(myStrategy);

    var doPassportInitialize = passport.initialize();
    var doPassportSession = passport.session();
    app.use(doPassportInitialize);
    app.use(doPassportSession);

    app.get('/auth/myauthendpoint', passport.authenticate('my_auth_provider'));

    app.get('/auth/myauthendpoint/callback', passport.authenticate('my_auth_provider', {
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
```

Follow the instructions for your selected Passport provider to configure your strategy, authorization function, and endpoints.

Call this startup in the node app:

```JavaScript
var authorization = require('./startup/authorization')(app, config);
```

Create a `public/login.html` page containing a link to your authorization provider's endpoint, as configured in `startup/authorization.js`. 

Copy `config/config.example.js` to `config/config.js` and edit the authentication parameters. Test the app to ensure that you can log in.