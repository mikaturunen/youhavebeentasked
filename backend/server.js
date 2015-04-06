var express = require("express");
var app = express();
var path = require("path");
var tasks = require("./REST/tasks");
var authentication = require("./auth/authentication");
var mongo = require("./mongo/mongo");

// TODO update front target
app.use("/public", express.static(path.join(__dirname, "..", "/frontend")));

authentication.init(app);
// Initialize all REST routes
tasks.init(app);

// Rest of the pages get index.html and 404 will be handled on the front 
var indexLocation = path.join(__dirname, "..", "/frontend/index.html");
app.get("*", function (req, res) {
    res.sendFile(indexLocation);
});

mongo
    .connect()
    .done(function() {
        // Start the server
        var server = app.listen(3000, function () {
            var host = server.address().address;
            var port = server.address().port;

            console.log("Example app listening at http://%s:%s", host, port);
        });
    }, console.log);
