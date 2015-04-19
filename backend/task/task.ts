
import mongo = require("../mongo/mongo");
import config = require("../config/config");
import team = require("../team/team");
import Q = require("q");
import mongodb = require("mongodb");

var ObjectId = require("mongodb").ObjectId;

/**
 * @module Task
 */
module Task {
    /*
     * Closure wrapped collection, gets fetched only one time on the first time and then remembers the collection.
     * @returns {mongodb.Collection} Task collection.
     */
    export function collection() {
        var taskCollection: mongodb.Collection;

        return (function() {
            if (!taskCollection) {
                taskCollection = mongo.collection(config.get().DATABASE_COLLECTION_TASK);
            }

            return taskCollection;
        })();
    }

    /**
     * Gets all Tasks for User.
     * @param  {string} userId User._id to look the Task documents with.
     * @return {Q.Promise<Task[]>} Resolves to Tasks on success. Rejects on Error.
     */
    export function getAllForUser(userId: string) {
        var deferred = Q.defer<any>();
        // TODO take team organizer into account too if required!

        mongo.find(team.collection(), {
                memberIds: { $in: [ new ObjectId(userId) ] }
            })
            .then((teams: any[]) => { 
                return mongo.find(Task.collection(), {
                    teamId: { $in: teams.map(function(team) { return new ObjectId(team._id); }) } 
                });
            })
            .then((tasks: any[]) => {
                console.log("Number of tasks found:", tasks.length);
                deferred.resolve(tasks);
            })
            .catch((error: any) => { 
                console.log("ERROR:", error);
                deferred.reject(error);
            })
            .done();

        return deferred.promise;
    } 
}

export = Task;
