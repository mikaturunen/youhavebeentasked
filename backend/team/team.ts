
import mongo = require("../mongo/mongo");
import mongodb = require("mongodb");
import config = require("../config/config");
import team = require("../team/team");
import Q = require("q");

var ObjectId = require("mongodb").ObjectId;

/**
 * @module Team
 */
module Team {
    /*
     * Closure wrapped collection, gets fetched only one time on the first time and then remembers the collection.
     * @returns {mongodb.Collection} Team collection.
     */
    export function collection() {
        var teamCollection: mongodb.Collection;

        return (() => {
            if (!teamCollection) {
                teamCollection = mongo.collection(config.get().DATABASE_COLLECTION_TEAM);
            }

            return teamCollection;
        })();
    }
}

export = Team;
