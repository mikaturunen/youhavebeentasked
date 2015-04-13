
var mongo = require("../mongo/mongo");
var config = require("../config/config");
var task = require("../task/task");
var auth = require("../auth/authentication");

/** 
 * Route for getting task lists.
 * @param {Express.Request} req Request object from Express
 * @param {Express.Response} res Response object from Express
 */
function getTaskList(req, res) {
    console.log("Getting tasks for user:", req.user.username);
    task
        .getAllForUser(req.user._id)
        .done(
            function(tasks) {
                console.log("tasks:", tasks);
                res.json(tasks);
            },
            function(error) {
                // TODO create real error objects for front to show to the world!
                res.status(500).jsonp({ foo: "bar" });
            }
        );   
}

/** 
 * Route for creating new tasks.
 * @param {Express.Request} req Request object from Express
 * @param {Express.Response} res Response object from Express
 */
function newTask(req, res) {
    task
        .insert(req.body.task)
        .done(
            function(task) {
                res.json(task);
            },
            function(error) {
                // TODO create real error objects for front to show to the world!
                res.status(500).jsonp({ foo: "bar" });
            }
        );
}

/**
 * Task routing module for all the REST interfaces that are associated with tasks
 * @module TaskRoutes
 */
var taskRoutes = {
    /**
     * Initialize all the Task REST routes.
     * @param {Object} app Express application.
     */
    init: function(app) {
        var prefix = "/api"; 

        app.get(prefix + "/tasks", function(req, res) { 
            auth.authenticate(req, res, getTaskList); 
        });

        app.post(prefix + "/tasks/new", function(req, res) { 
            auth.authenticate(req, res, getTaskList); 
        });
    }
};

module.exports = taskRoutes;
