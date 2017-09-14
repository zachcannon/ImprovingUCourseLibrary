# ImprovingU

Course survey site

## Overview

This web application is used for gathering and disseminating information about ImprovingU courses. ImprovingU is a series of courses taught by Improvers for Improvers. [Improvers](http://improving.com) can use this website to propose new course ideas, vote for courses for the upcoming semester, and register for courses. Instructors can use this website to edit information about their course and take attendance for each class. 
 - Tech Stack
   - Front End: KnockoutJS, HTML, CSS, [Jinaga](http://jinaga.com)
   - Back End: NodeJS, MongoDB
 - Production URL
   - https://improvingucourses.azurewebsites.net
 - Backlog
   - https://trello.com/c/kT07QzHH/131-improvingu-course-attendance-app

## Requirements

* Node 5.0.0
* Mongo 3.0.0

## Installation

Clone the repository. Run `npm install`. Copy `config/config.example.js` to `config/config.js`. Run `DEBUG=jinaga* node server`.

Navigate to `http://localhost:8080/status` to see if there were any errors during startup. This is especially helpful once you deploy it to a remote server.

You will need to configure a Mongo database and Google OAuth2 credentials.

### Mongo

By default, the application is configured to use the Mongo instance at `mongodb://localhost:27017/dev`. This is the default port, so if you have Mongo installed and running, you should be good.

To change the configuration, either set the `mongoDB` setting in `config/config.js`, or set the `MONGO_DB` environment variable. The environment variable takes precedence, and is intended for server deployments. The configuration setting is easier for development.

```JavaScript
module.exports = {
    mongoDB: 'mongodb://localhost:27017/improvingu'
};
```

### Google OAuth2

This application example is configured to use Google OAuth2. To switch to a different provider, install a different NPM package for your chosen [Passport](http://passportjs.org) strategy. I recommend sticking with the Google strategy for your first time.

Go to the [Google Developers Console](https://console.developers.google.com) and create a new project. Go to the API Manager in the hamburger menu, and select Credentials. Create new credentials of type "OAuth client ID" for a "Web application".

Add an authorized JavaScript origin for `http://localhost:8080`. Add an authorized redirect URI for `http://localhost:8080/login/callback`. Copy your client ID and client secret and put them into `config/config.js`.

```JavaScript
module.exports = {
    google: {
        clientId: '12345-xxxxxx.apps.googleusercontent.com',
        clientSecret: 'yyyyyyy'
    }
};
```

Back on the "Credentials" screen, click on the "OAuth consent screen" tab and set up your email address and product name.

Then, back in the API Manager screen, under "Social APIs", choose "Google+ API". Enable the API. This is necessary to get the user's profile name.

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

Create a `server.js` with the following code:

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

var pipeline = {
    cookieParser: cookieParser(),
    bodyParserUrlEncoded: bodyParser.urlencoded({extended: true}),
    session: session({
        secret: process.env.SESSION_SECRET || config.sessionSecret || "randomCharacters",
        saveUninitialized: true,
        resave: true
    })
};
app.use(pipeline.cookieParser);
app.use(pipeline.bodyParserUrlEncoded);
app.use(pipeline.session);

// Set up the public site
app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
});

// Additional startup will go here.

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
            var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
            delete req.session.redirect_to;
            res.redirect( redirect_to );
        }
    );

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
```

Follow the instructions for your selected Passport provider to configure your strategy, authorization function, and endpoints.

Call this startup in server.js where indicated by the above comment:

```JavaScript
var authorization = require('./startup/authorization')(app, config);
```

Create a `public/login.html` page containing a link to your authorization provider's endpoint, as configured in `startup/authorization.js`. 

Copy `config/config.example.js` to `config/config.js` and edit the authentication parameters. Test the app to ensure that you can log in.

### Private area

Create a page called `private/ideas.html`. This will be a page listing course ideas. This page will only be available to logged in users.

Configure the route to require authorization. Add the following to `server.js`.

```JavaScript
app.use("/private", authorization.require, express.static(__dirname + "/private"));
```

Add a link to `private/ideas.html` into the site navigation. Test by running the app. When you click on the link, you should be redirected to the login page. After logging in, you should be redirected to the private page.

### Jinaga distributor

Now we can finally configure Jinaga. Install Jinaga using `npm install -save jinaga`, and Chain Middleware using `npm install -save chain-middleware`. Then create a file called `startup/distributor.js` with the following code:

```JavaScript
module.exports = function( server, pipeline, authorization, config ) {
    var JinagaDistributor = require("jinaga/jinaga.distributor.server");
    var MongoProvider = require("jinaga/jinaga.mongo");
    var chain = require('chain-middleware');

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
```

Call this function from server.js immediately after the authorization startup.

```JavaScript
require('./startup/distributor')(server, pipeline, authorization, config);
``` 

Install Jinaga for the client-side using Bower:

```
bower install -save jinaga
```

Create a client-side JavaScript file called `private/ideas.js`. This will be the single-page application for the ideas page.

```JavaScript
var j = new Jinaga();
j.sync(new JinagaDistributor("ws://localhost:8080/"));

j.login(function (u, profile) {
  if (!u) {
    window.location = "http://localhost:8080/public/login.html";
  }
  else {
    console.log("Logged in: " + profile.displayName);
  }
});
```

Load Jinaga and start `ideas.js` from the `ideas.html` page.

```
<script src="/bower_components/jinaga/jinaga.js"></script>
<script src="/private/ideas.js"></script>
```

Test by starting Mongo, running `node server`, bringing up the browser developer tools, and navigating to the Ideas page. After you log in, you should see a message in the console.

If you don't see the message, make sure you have started Mongo. Then run the app with debug output so you can see what's happening:

```
DEBUG=jinaga* node app
```

### Knockout

Although Jinaga will work with any JavaScript front end library, this application uses Knockout.js. Install it with `bower install -save knockout`. Include it in `ideas.html`.

```
<script src="/bower_components/knockout/dist/knockout.js"></script>
```

Create a view model in `ideas.js`. Create observables for the user and display name.

```JavaScript
var viewModel = {
    user: ko.observable(),
    displayName: ko.observable()
};

ko.applyBindings(viewModel);
```

Data bind the display name to the page.

```
<ul class="nav navbar-nav navbar-right">
    <li><a href="#" data-bind="text: displayName"></a></li>
</ul>
```

Modify the login callback to set the user and update the display name.

```JavaScript
viewModel.user(u);
j.query(u, [namesForUser], function(names) {
    if (names.length != 1 || names[0].value !== profile.displayName) {
        j.fact({
            type: "ImprovingU.UserName",
            prior: names,
            from: u,
            value: profile.displayName
        });
    }
});
```

Where the template functions are defined as such:

```JavaScript
function nameIsCurrent(n) {
    return j.not({
        type: "ImprovingU.UserName",
        prior: n
    });
}

function namesForUser(u) {
    return j.where({
        type: "ImprovingU.UserName",
        from: u
    }, [nameIsCurrent]);
}
```

This creates `UserName` facts when necessary to record the user's display name. But it doesn't update the view model. To update the display name in the view model, subscribe to the `user` and create a watch.

```JavaScript
viewModel.user.subscribe(function (u) {
    j.watch(u, [namesForUser], function (n) {
        viewModel.displayName(n.value);
    });
});
```

Test by running the app and logging in. Your name should appear on the right side of the nav bar.

## Features

Now that we have a basic site, let's add some features:

- [Submit course ideas](https://github.com/jinaga/ImprovingU/blob/master/NewIdea.md)
- [Vote on course ideas](https://github.com/jinaga/ImprovingU/blob/master/Vote.md)
