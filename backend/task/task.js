
var mongo = require("../mongo/mongo");
var config = require("../config/config");
var team = require("../team/team");

var ObjectId = require("mongodb").ObjectId;
var Q = require("q");

/**
 * @module Task
 */
var task = {
    /*
     * Closure wrapped collection, gets fetched only one time on the first time and then remembers the collection.
     * @returns {MongoCollection} Task collection.
     */
    collection: function() {
        var taskCollection;
        return (function() {
            if (!taskCollection) {
                taskCollection = mongo.collection(config.DATABASE_COLLECTION_TASK);
            }

            return taskCollection;
        })();
    },

    /**
     * Insert Task document into database.
     * @param  {Task} document Inserts new Task document into database
     * @return {Q.Promise<Task>} Resolves to inserted Task on success. Rejects on Error.
     */
    insert: function(document) {

    },

    /**
     * Gets all Tasks for User.
     * @param  {string} userId User._id to look the Task documents with.
     * @return {Q.Promise<Task[]>} Resolves to Tasks on success. Rejects on Error.
     */
    getAllForUser: function(userId) {
        var deferred = Q.defer();
        // TODO take team organizer into account too if required!

        mongo.query(team.collection(), {
                members: { $in: [ new ObjectId(userId) ] }
            })
            .then(function(teams) { 
                return mongo.find(task.collection(), {
                    teamId: { $in: teams.map(function(team) { return new ObjectId(team._id); }) } 
                });
            })
            .then(function(tasks) {
                console.log("Number of tasks found:", tasks.length);
                deferred.resolve(tasks);
            })
            .catch(function(error) { 
                // TODO handle error properly instead of idiotic res.json :)
                console.log("ERROR:", error);
                deferred.reject(error);
            })
            .done();

        return deferred.promise;
    } 
};

module.exports = task;
