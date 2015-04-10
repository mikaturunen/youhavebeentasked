
var mongo = require("../mongo/mongo");
var config = require("../config/config");
var task = require("../task/task");
var auth = require("../auth/authentication");

function getTaskList(req, res) {
    console.log("Getting tasks for user:", req.user.username);
    task
        .getAllForUser(req.user._id)
        .done(
            function(tasks) {
                res.json(tasks);
            },
            function(error) {
                // tODO error
            }
        );   
}

/** Simply creates a new dummy task. */
function newTask(req, res) {
    if (req.body.task) {
        console.log("no task present", req.body);
    }

    task
        .insert(req.body.task)
        .done(
            function(task) {
                res.json(task);
            },
            function(error) {
                // TODO error
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

        app.get(prefix + "/tasks", auth.authenticate, getTaskList);
        app.post(prefix + "/tasks/new", auth.authenticate, newTask);
    }
};

module.exports = taskRoutes;
