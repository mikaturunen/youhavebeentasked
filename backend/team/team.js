
var mongo = require("../mongo/mongo");
var config = require("../config/config");
var team = require("../team/team");

var ObjectId = require("mongodb").ObjectId;
var Q = require("q");

/**
 * @module Team
 */
var team = {
    /*
     * Closure wrapped collection, gets fetched only one time on the first time and then remembers the collection.
     * @returns {MongoCollection} Team collection.
     */
    collection: function() {
        var teamCollection;
        return (function() {
            if (!teamCollection) {
                teamCollection = mongo.collection(config.DATABASE_COLLECTION_TEAM);
            }

            return teamCollection;
        })();
    }

};

module.exports = team;
