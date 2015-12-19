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

Create an empty directory and initialize a Node application using `npm init`. Also initialize a Git repository using `git init`.

Install Bower with `npm install -save bower`. Initialize it with `bower init` and select the "globals" package style.

Install Express with `npm install -save express`. Create an `app.js` with the following code:

```JavaScript
var http = require('http');
var express = require('express');

var config = {};
try {
    config = require('./config/config');
}
catch (err) {}

var app = express();
var server = http.createServer(app);
app.server = server;

app.use("/bower_components", express.static(__dirname + "/bower_components"));
app.use("/public", express.static(__dirname + "/public"));
app.get('/', function(req, res, next) {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(config.port | 8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('ImprovingU listening at http://%s:%s', host, port);
});
```

Create an HTML file in `public/index.html`. Run `node app` and browse to `http://localhost:8080` to test.

Install Bootstrap with `bower install -save bootstrap`. Copy a starting page to `public/index.html` and `public/style.css`, and modify the CSS and JS links:

```
<link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="public/style.css" rel="stylesheet">
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
```

Test it by starting the app and refreshing the browser.
