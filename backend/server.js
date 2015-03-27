var express = require("express");
var app = express();

// TODO update front target
app.use("/public", express.static(__dirname + "/frontend"));

// Currently serve out everything like this -- dish it out like it means something
app.get("*", function (req, res) {
    res.send("Hello World!")
});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});