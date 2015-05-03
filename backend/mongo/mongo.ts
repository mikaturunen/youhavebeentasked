
import Q = require("q");
import mongodb = require("mongodb");
import { default as config, buildMongoConnection } from "../config/config";

/** @type {string} Urls that's build fron the application configuration and acts as the base configuration. */
var configuredUrl = buildMongoConnection();
/** Database connection to MongoDB */
var connectedDatabase: any;
var MongoClient = mongodb.MongoClient;

/**
 * Super simple database module that wraps most of the mongodb behavior into a promise and unifies the use cases a bit.
 * @module Database
 */
module Database {
    /**
     * Connects to the MongoDB database.
     * @returns {Q.Promise<boolean>} Resolves to true on success. Rejects on error with error. Logs error internally.
     */
    export function connect() {
        var deferred = Q.defer<boolean>();

        // Reusing the function is allowed - if database is present it assumes everything is working as it should
        if (connectedDatabase) {
            console.log("Database connection present.");
            deferred.resolve(true);
            return deferred.promise;
        }

        MongoClient.connect(configuredUrl, (error: Error, mongoDatabase: mongodb.Db) => {
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

    /**
     * Gets a specified collection from MongoDB
     * @param {string} collection Collection to get from Mongo database
     * @returns {mongodb.Collection} Collection with the specified naem
     */
    export function collection(collection: string) {
        return connectedDatabase.collection(collection);
    }

    /**
     * Short-hand for find.toArray on a specific collection. This should be used over the query('find').done() style
     * of usage. For other querys the query function can be used
     * @param  {mongodb.Collection} mongoCollection Specific mongo collection
     * @param  {any} query Query object for Mongo
     * @return {Q.Promise<T[]>} Resolves on success into an array of results. Rejects on error with a message
     */
    export function find<T>(mongoCollection: mongodb.Collection, query: any) {
        var deferred = Q.defer<T>();

        mongoCollection
            .find(query)
            .toArray((error: Error, documents: any[]) => {
                if (error) {
                    console.log("Error in find documents for collection:", error);
                    deferred.reject(error);
                    return;
                }

                deferred.resolve(<T>(<any>documents));
            });

        return deferred.promise;
    }

    /**
     * Query method for a mongo collection
     * @param  {mongodb.Collection}   mongoCollection Mongo collection
     * @param  {string} callback Callback to call from the collection
     * @param  {any} query Query for the callback
     * @return {Q.Promise<T>} Resolves on success into the result from the query. Rejects on error with the message.
     */
    export function query<T>(mongoCollection: mongodb.Collection, callback: string, query: any) {
        var deferred = Q.defer<T>();
        console.log("Querying:", callback, query);

        (<any> mongoCollection)[callback](query, (error: Error, response: any[]) => {
            if (error) {
                console.log("Error 'query':", callback, query, ">>", error);
                deferred.reject(error);
                return;
            }

            deferred.resolve(<T>(<any> response));
        });

        return deferred.promise;
    }

    /**
     * Closes mongodb connection.
     */
    export function close() {
        if (connectedDatabase) {
            connectedDatabase.close();
        }
    }
};

export default Database;
