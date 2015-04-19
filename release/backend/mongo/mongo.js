var Q = require("q");
var config = require("../config/config");
var mongodb = require("mongodb");
var configuredUrl = config.buildMongoDatabaseConnectionString();
var connectedDatabase;
var MongoClient = mongodb.MongoClient;
var Database;
(function (Database) {
    function connect() {
        var deferred = Q.defer();
        if (connectedDatabase) {
            console.log("Database connection present.");
            deferred.resolve(true);
            return deferred.promise;
        }
        MongoClient.connect(configuredUrl, function (error, mongoDatabase) {
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
    }
    Database.connect = connect;
    function collection(collection) {
        return connectedDatabase.collection(collection);
    }
    Database.collection = collection;
    function find(mongoCollection, query) {
        var deferred = Q.defer();
        mongoCollection.find(query).toArray(function (error, documents) {
            if (error) {
                console.log("Error in find documents for collection:", error);
                deferred.reject(error);
                return;
            }
            deferred.resolve(documents);
        });
        return deferred.promise;
    }
    Database.find = find;
    function query(mongoCollection, callback, query) {
        var deferred = Q.defer();
        console.log("Querying:", callback, query);
        mongoCollection[callback](query, function (error, response) {
            if (error) {
                console.log("Error 'query':", callback, query, ">>", error);
                deferred.reject(error);
                return;
            }
            deferred.resolve(response);
        });
        return deferred.promise;
    }
    Database.query = query;
    function close() {
        if (connectedDatabase) {
            connectedDatabase.close();
        }
    }
    Database.close = close;
})(Database || (Database = {}));
;
module.exports = Database;
