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
        title: "Do the laundry",
        description: "Sort into loads, wash them, hang permanent press, dryer items and fold/ut away",
        events: [{  
            start: 1427241600
        }],
        done: false
    },
    {
        title: "Floor cleaning",
        description: "Dry mop/sweep, wet mop/scrub floors, vacuum, shampoo carpets, wax (If you are really ambitious!)",
        events: [],
        done: false
    },
    {
        title: "Clean the yard",
        description: "Clean pool, camper/boat, garage/shed",
        events: [{  
            start: 1427241600
            end: Date.now()
        }],
        done: true
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