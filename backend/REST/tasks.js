
var mongo = require("../mongo/mongo");
var config = require("../config/config");

var ObjectId = require("mongodb").ObjectId;
var taskCollection;
var teamCollection;

function incrementer() {
    var id = 0;
    return function() {
        var tmp = id;
        id++;
        return tmp;
    }
}
var generateId = incrementer();

function getTaskList(req, res) {
    if (!req.user) {
        console.log("No user present - not allowed to query tasks!");
        // TODO res.error(unauthorized)
        return;
    }

    console.log("Getting tasks for user:", req.user.username);
    
    // TODO take team organizer into account too if required!

    mongo.find(teamCollection, {
            members: { $in: [ new ObjectId(req.user._id) ] }
        })
        .then(function(teams) { 
            console.log("teams:", teams.length);

            return mongo.find(taskCollection, {
                teamId: { $in: teams.map(function(team) { return new ObjectId(team._id); }) } 
            });
        })
        .then(function(tasks) {
            console.log("Number of tasks found:", tasks.length);
            res.json(tasks);
        })
        .catch(function(error) { 
            // TODO handle error properly instead of idiotic res.json :)
            console.log("ERROR:", error);
            res.json(error);
        })
        .done();
}

/** Simply creates a new dummy task. */
function newTask(req, res) {
    console.log(req.body);

    var task = { 
        id: generateId(),
        title: "new task",
        description: "...",
        events: [],
        done: false
    }; 

    taskList.push(task)
    res.json(task);
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
        // TODO create separate wrapping modules for tasks and teams for centralized manipulation of them instead of 
        // like this 
        taskCollection = mongo.collection(config.DATABASE_COLLECTION_TASK);
        teamCollection = mongo.collection(config.DATABASE_COLLECTION_TEAM);

        var prefix = "/api"; 
        [
            { route: prefix + "/tasks", callback: getTaskList, method: "get" },
            { route: prefix + "/tasks/new", callback: newTask, method: "post" }
        ].forEach(function(router) {
            app[router.method](router.route, router.callback)
        });
    }
};

module.exports = taskRoutes;
