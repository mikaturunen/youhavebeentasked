var express = require("express");
var app = express();
var path = require("path");
var tasks = require("./REST/tasks");
var authentication = require("./auth/authentication");

// TODO update front target
app.use("/public", express.static(path.join(__dirname, "..", "/frontend")));

authentication.init(app);
app.post("/api/login", function(req, res) {
    console.log("/api/login called - user attempting to login.", req.user, req.body);
    res.json({ foo: "bar" });
});
// Initialize all REST routes
tasks.init(app);

// Rest of the pages get index.html and 404 will be handled on the front 
var indexLocation = path.join(__dirname, "..", "/frontend/index.html");
app.get("*", function (req, res) {
    res.sendFile(indexLocation);
});

// Start the server
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});