/** @type {Object[]} List of temp tasks before I move them to the db - should happen really soon now */
var taskList = [
    {
        id: 1,
        title: "Do the laundry",
        description: "Sort into loads, wash them, hang permanent press, dryer items and fold/ut away",
        events: [{  
            start: 1427241600
        }],
        done: false
    },
    {
        id: 2,
        title: "Floor cleaning",
        description: "Dry mop/sweep, wet mop/scrub floors, vacuum, shampoo carpets, wax (If you are really ambitious!)",
        events: [],
        done: false
    },
    {
        id: 3,
        title: "Clean the yard",
        description: "Clean pool, camper/boat, garage/shed",
        events: [{  
            start: 1427241600,
            end: Date.now()
        }],
        done: true
    }
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
        // TODO move rest routes to their own location
        app.get("/tasks", function(req, res) {
            console.log("Getting tasks");
            res.json(taskList);
        });
    }
};

module.exports = taskRoutes;
