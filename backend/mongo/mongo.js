
var Q = require("q");
var MongoClient = require("mongodb").MongoClient;
var config = require("../config/config");

/** @type {string} Urls that's build fron the application configuration and acts as the base configuration. */
// TODO read from config + env variables -- now configured to default win mongodb port 
var configuredUrl = config.buildMongoDatabaseConnectionString();
/** Database connection to MongoDB */
var connectedDatabase;

var database = {
    /**
     * Connects to the MongoDB database.
     */
    connect: function() {
        var deferred = Q.defer();

        // Reusing the function is allowed - if database is present it assumes everything is working as it should
        if (connectedDatabase) {
            console.log("Database connection present.");
            deferred.resolve(true);
            return deferred.promise;
        }

        MongoClient.connect(configuredUrl, function(error, mongoDatabase) {
            if (error) {
                console.log("Error connecting to mongodb:", error);
                deferred.reject(error);
                return;
            }

            console.log("Connected to mongodb database.");
            connectedDatabase = mongoDatabase;
            deferred.resolve(true);
        });

        return deferred.promise;
    },

    /**
     * Gets a specified collection from MongoDB
     * returns {Mongodb.Collection} Collection with the specified naem
     */
    collection: function(collection) {
        return connectedDatabase.collection(collection);
    },

    query: function(mongoCollection, callback, query) {
        var deferred = Q.defer();
        console.log("Querying:", callback, query);
        
        mongoCollection[callback](query, function(error, response) {
            if (error) {
                console.log("Error 'query':", callback, query, ">>", error);
                deferred.reject(error);
                return;
            }

            deferred.resolve(response);
        });

        return deferred.promise;
    },

    close: function() {
        if (connectedDatabase) {
            connectedDatabase.close();
        }
    }
};

module.exports = database;