
import mongo = require("../mongo/mongo");
import config = require("../config/config");
import Q = require("q");
import mongodb = require("mongodb");

var ObjectId = require("mongodb").ObjectId;

/**
 * @module User
 */
module User {
    /*
     * Closure wrapped collection, gets fetched only one time on the first time and then remembers the collection.
     * @returns {mongodb.Collection} User collection.
     */
    export function collection() {
        var userCollection: mongodb.Collection;

        return (() => {
            if (!userCollection) {
                userCollection = mongo.collection(config.get().DATABASE_COLLECTION_USER);
            }

            return userCollection;
        })();
    }

    /**
     * Gets user based on the username
     * @param  {string} username Username to find
     * @return {Q.Promise<User>} Resolves to User on success. Rejects on Error.
     */
    export function getByUsername(username: string) {
        return mongo.query(User.collection(), "findOne", { username: username });
    }

    /**
     * Gets user based on the User._id
     * @param  {string} userId Mongo generated document id for User.
     * @return {Q.Promise<User>} Resolves to User on success. Rejects on Error.
     */
    export function getById(userId: string) {
        return mongo.query(User.collection(), "findOne", { _id: new ObjectId(userId) });
    }
}

export = User;
