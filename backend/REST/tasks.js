
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
        description: "...",
        events: [],
        done: false
    });
}

/** @type {Object[]} List of temp tasks before I move them to the db - should happen really soon now */
var taskList = [ 
    { 
        id: generateId(),
        title: "Do the laundry",
        description: "Sort into loads, wash them, hang permanent press, dryer items and fold/ut away",
        events: [{ start: 1427241600 }],
        done: false
    }, 
    { 
        id: generateId(),
        title: "Floor cleaning",
        description: "Dry mop/sweep, wet mop/scrub floors, vacuum, shampoo carpets, wax (If you are really ambitious!)",
        events: [],
        done: false
    }, 
    { 
        id: generateId(),
        title: "Clean the yard",
        description: "Clean pool, camper/boat, garage/shed",
        events: [{ start: 1427241600, end: Date.now() }],
        done: true
    }, 
];

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
        [
            { route: prefix + "/tasks", callback: getTaskList, method: "get" },
            { route: prefix + "/tasks/new", callback: newTask, method: "post" }
        ].forEach(function(router) {
            app[router.method](router.route, router.callback)
        });
    }
};

module.exports = taskRoutes;
