var express = require("express");
var app = express();
var path = require("path");

// TODO update front target
app.use("/public", express.static(path.join(__dirname, "..", "/frontend")));

var indexLocation = path.join(__dirname, "..", "/frontend/index.html");
app.get("/", function (req, res) {
    res.sendFile(indexLocation);
});

var tasks = [
    {
        description: "a",
        title: "b",
        events: []
    },
    {
        description: "b",
        title: "a",
        events: []
    }
];

app.get("/tasks", function(req, res) {
    console.log("Getting tasks");
    res.json(tasks);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});