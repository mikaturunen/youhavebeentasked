
var Q = require("q");
var MongoClient = require("mongodb").MongoClient;
var config = require("../config/config");

/** @type {string} Urls that's build fron the application configuration and acts as the base configuration. */
// TODO read from config + env variables -- now configured to default win mongodb port 
var configuredUrl = config.buildMongoDatabaseConnectionString();
/** Database connection to MongoDB */
var database;

var database = {
    /**
     * Connects to the MongoDB database.
     */
    connect: function() {
        var deferred = Q.defer();

        MongoClient.connect(configuredUrl, function(error, mongoDatabase) {
            if (error) {
                console.log("Error connecting to mongodb:", error);
                deferred.reject(error);
                return;
            }

            console.log("Connected to mongodb database.");
            database = mongoDatabase;
            deferred.resolve(true);
        });

        return deferred.promise;
    },

    /**
     * Gets a specified collection from MongoDB
     * returns {Mongodb.Collection} Collection with the specified naem
     */
    collection: function(collection) {
        return database.collection(collection);
    }
};

module.exports = database;