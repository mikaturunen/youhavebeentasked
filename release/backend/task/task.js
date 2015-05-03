"use strict";

var mongo = require("../mongo/mongo");
var config = require("../config/config");
var team = require("../team/team");
var Q = require("q");
var ObjectId = require("mongodb").ObjectId;
var Task;
(function (Task) {
    function collection() {
        var taskCollection;
        return (function () {
            if (!taskCollection) {
                taskCollection = mongo.collection(config.get().DATABASE_COLLECTION_TASK);
            }
            return taskCollection;
        })();
    }
    Task.collection = collection;
    function getAllForUser(userId) {
        var deferred = Q.defer();
        mongo.find(team.collection(), {
            memberIds: { $in: [new ObjectId(userId)] }
        }).then(function (teams) {
            return mongo.find(Task.collection(), {
                teamId: { $in: teams.map(function (team) {
                        return new ObjectId(team._id);
                    }) }
            });
        }).then(function (tasks) {
            console.log("Number of tasks found:", tasks.length);
            deferred.resolve(tasks);
        })["catch"](function (error) {
            console.log("ERROR:", error);
            deferred.reject(error);
        }).done();
        return deferred.promise;
    }
    Task.getAllForUser = getAllForUser;
})(Task || (Task = {}));
module.exports = Task;