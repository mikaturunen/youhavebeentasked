
var mongo = require("../mongo/mongo");
var config = require("../config/config");

var ObjectId = require("mongodb").ObjectId;
var Q = require("q");

/**
 * @module User
 */
var user = {
    /*
     * Closure wrapped collection, gets fetched only one time on the first time and then remembers the collection.
     * @returns {MongoCollection} User collection.
     */
    collection: function() {
        var userCollection;
        return (function() {
            if (!userCollection) {
                userCollection = mongo.collection(config.DATABASE_COLLECTION_USER);
            }

            return userCollection;
        })();
    },

    /**
     * Gets user based on the username
     * @param  {string} username Username to find
     * @return {Q.Promise<User>} Resolves to User on success. Rejects on Error.
     */
    getByUsername: function(username) {
        return mongo.query(user.collection(), "findOne", { username: username });
    },

    /**
     * Gets user based on the User._id
     * @param  {string} userId Mongo generated document id for User.
     * @return {Q.Promise<User>} Resolves to User on success. Rejects on Error.
     */
    getById: function(userId) {
        return mongo.query(user.collection(), "findOne", { _id: new ObjectId(userid) });
    }
};

module.exports = user;
