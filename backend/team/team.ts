
import mongo from "../mongo/mongo";
import config from "../config/config";
import team from "../team/team";

import mongodb = require("mongodb");
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
                teamCollection = mongo.collection(config().DATABASE_COLLECTION_TEAM);
            }

            return teamCollection;
        })();
    }
}

export default Team;
