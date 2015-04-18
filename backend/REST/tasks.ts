
var mongo = require("../mongo/mongo");
var config = require("../config/config");
var task = require("../task/task");
var auth = require("../auth/authentication");

// Requiring express to dig out the real interfaces for response and not the so called merge-ready Express.Response
import express = require("express");

// These are types that are internally used by this module 
/**
 * Interface that extends the Request object to contain the specified Task object.
 */
interface TaskRequest extends Express.Request {
    // TODO update task to proper type once it's defined
    body: {
        task: any;
    }
}

/** 
 * Route for getting task lists.
 * @param {UserRequest} req Request object from Express with the User details contained in it.
 * @param {Express.Response} res Response object from Express
 */
function getTaskList(req: UserRequest, res: express.Response) {
    console.log("Getting tasks for user:", req.user.username);
    task
        .getAllForUser(req.user._id)
        .done(
            function(tasks: any) {
                console.log("tasks:", tasks);
                res.json(tasks);
            },
            function(error: any) {
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
function newTask(req: TaskRequest, res: express.Response) {
    task
        .insert(req.body.task)
        .done(
            // TODO update task type once it's defined
            function(task: any) {
                res.json(task);
            },
            // TODO update error type once it's defined, create centralized error creation
            function(error: any) {
                // TODO create real error objects for front to show to the world!
                res.status(500).jsonp({ foo: "bar" });
            }
        );
}

/**
 * Module for the REST routes that relate to task manipulation.
 * @module RestifiedTaskRoutes
 */
module RestifiedTaskRoutes {
    /*
     * Initializes the different REST task routes.
     * @param {any} app Express application.
     */
    export function init(app: express.Application) {
        var prefix = "/api"; 

        app.get(prefix + "/tasks", (req: UserRequest, res: express.Response) => { 
            auth.authenticate(req, res, getTaskList); 
        });

        /*app.post(prefix + "/tasks/new", (req: TaskRequest, res: Express.Response) => { 
            auth.authenticate(req, res, getTaskList); 
        });*/
    }
}

export = RestifiedTaskRoutes;
