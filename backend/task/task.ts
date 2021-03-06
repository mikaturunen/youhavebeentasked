
import mongo from "../mongo/mongo";
import config from "../config/config";
import team from "../team/team";

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
                taskCollection = mongo.collection(config().DATABASE_COLLECTION_TASK);
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
        var deferred = Q.defer<Task[]>();
        // TODO take team organizer into account too if required!

        mongo.find<Team[]>(team.collection(), {
                memberIds: { $in: [ new ObjectId(userId) ] }
            })
            .then((teams: Team[]) => {
                return mongo.find<Task[]>(Task.collection(), {
                    teamId: { $in: teams.map(function(team) { return new ObjectId(team._id); }) }
                });
            })
            .then((tasks: Task[]) => {
                console.log("Number of tasks found:", tasks.length);
                deferred.resolve(tasks);
            })
            .catch((error: Error) => {
                console.log("ERROR:", error);
                deferred.reject(error);
            })
            .done();

        return deferred.promise;
    }
}

export default Task;
