var express = require("express");
var path = require("path");
var authentication = require("./auth/authentication");
var mongo = require("./mongo/mongo");
var restifiedTaskRoutes = require("./REST/tasks");
mongo.connect().done(function () {
    var app = express();
    app.use("/public", express.static(path.join(__dirname, "..", "/frontend")));
    authentication.init(app);
    restifiedTaskRoutes.init(app);
    var indexLocation = path.join(__dirname, "..", "/frontend/index.html");
    app.get("*", function (req, res) {
        res.sendFile(indexLocation);
    });
    var server = app.listen(3000, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log("Example app listening at http://%s:%s", host, port);
    });
}, console.log);
