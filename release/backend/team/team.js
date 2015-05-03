"use strict";

var mongo = require("../mongo/mongo");
var config = require("../config/config");
var ObjectId = require("mongodb").ObjectId;
var Team;
(function (Team) {
    function collection() {
        var teamCollection;
        return (function () {
            if (!teamCollection) {
                teamCollection = mongo.collection(config.get().DATABASE_COLLECTION_TEAM);
            }
            return teamCollection;
        })();
    }
    Team.collection = collection;
})(Team || (Team = {}));
module.exports = Team;