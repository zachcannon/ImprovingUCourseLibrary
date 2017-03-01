var jinaga_app = require('jinaga.app');
var Roster = require('./roster/roster');

var server = jinaga_app.start(__dirname);
var app = server.app;
var j = server.j;

var roster = new Roster(j);
roster.start();

app.get("/roster/:office.csv", function(req, res, next) {
    var office = req.params.office;
    res.setHeader('content-type', 'text/csv');
    res.send(roster.get(office));
    res.end();
});
