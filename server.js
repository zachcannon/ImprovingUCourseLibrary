var jinaga_app = require('jinaga.app');
var roster = require('./roster/roster');

var server = jinaga_app.start(__dirname);
var app = server.app;
var j = server.j;

app.get("/roster/:office.csv", function(req, res, next) {
    var office = req.params.office;
    roster.get(j, office, res);
});
