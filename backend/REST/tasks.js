
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
    console.log("Getting tasks");
    res.json(taskList);
}

function newTask(req, res) {
    console.log(req.body);
    res.json({
        id: generateId(),
        title: "new task",
        description: ". . .",
        events: [],
        done: false
    });
}

/** @type {Object[]} List of temp tasks before I move them to the db - should happen really soon now */
var taskList = [ newTask(), newTask(), newTask() ];
// Prefill them with information
taskList[0].title = "Do the laundry";
taskList[0].description = "Sort into loads, wash them, hang permanent press, dryer items and fold/ut away";
taskList[0].events.push({ start: 1427241600 });
taskList[1].title =  "Floor cleaning";
taskList[1].description = "Dry mop/sweep, wet mop/scrub floors, vacuum, shampoo carpets, wax (If you are really ambitious!)";
taskList[2].title = "Clean the yard";
taskList[2].description = "Clean pool, camper/boat, garage/shed";
taskList[2].events.push({ start: 1427241600, end: Date.now() });
taskList[2].done = true;

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
        var prefix = "/api"
        [
            { route: prefix + "/tasks", callback: getTaskList, method: "get" },
            { route: prefix + "/tasks/new", callback: newTask, method: "post" }
        ]
        .forEach(function(router) {
            app[router.method](router.route, router.callback)
        });

        // TODO move rest routes to their own location
        app.get("/api/tasks", );
    }
};

module.exports = taskRoutes;
