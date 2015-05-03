"use strict";

var mongo = require("../mongo/mongo");
var config = require("../config/config");
var task = require("../task/task");
var auth = require("../auth/authentication");
function getTaskList(req, res) {
    console.log("Getting tasks for user:", req.user.username);
    task.getAllForUser(req.user._id).done(function (tasks) {
        console.log("tasks:", tasks);
        res.json(tasks);
    }, function (error) {
        res.status(500).jsonp({ foo: "bar" });
    });
}
function newTask(req, res) {
    task.insert(req.body.task).done(function (task) {
        res.json(task);
    }, function (error) {
        res.status(500).jsonp({ foo: "bar" });
    });
}
var RestifiedTaskRoutes;
(function (RestifiedTaskRoutes) {
    function init(app) {
        var prefix = "/api";
        app.get(prefix + "/tasks", function (req, res) {
            auth.authenticate(req, res, getTaskList);
        });
    }
    RestifiedTaskRoutes.init = init;
})(RestifiedTaskRoutes || (RestifiedTaskRoutes = {}));
module.exports = RestifiedTaskRoutes;