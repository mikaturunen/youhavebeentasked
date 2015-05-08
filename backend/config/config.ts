
const configuration = require("./config.json");

/** @type {Object} Exposed configuration object that will be built from config.json and environmental variables.  */
let config: any = { };

/**
 * Loads the configuration object with details from process.env and config.json
 */
function loadConfiguration() {
    // Loads all the keys into the Config Object.
    Object.keys(configuration).forEach((property: string) => {
        if (property.slice(0, 2) == "__") {
            // Values that start with __ can be skipped, they are meant for information only so the 3rd party can understand
            // the json (they are like comments) - json by nature does not support comments so..
            return;
        }

        var value = configuration[property];

        if (process.env[property] !== "" && process.env[property] !== null && process.env[property] !== undefined) {
            value = process.env[property];
        }

        if (value !== null && value !== undefined && value.trim() !== "") {
            console.log("Config key value:", property, value);
            config[property] = "" + value;
        }
    });
}

/**
 * Interface for the environment relates configurations.
 */
export interface EnvironmentalConfig {
    DATABASE_URL: string;
    DATABASE_PORT: string;
    DATABASE_SUFFIX: string;
    DATABAASE_USER: string;
    DATABAASE_PASSWORD: string;
    DATABASE_COLLECTION_USER: string;
    DATABASE_COLLECTION_GROUP: string;
    DATABASE_COLLECTION_TEAM: string;
    DATABASE_COLLECTION_TASK: string;

    /**
     * Builds a specific mongodb connection string by combining different related variables.
     * @returns {string} Connection url to a valid mongo db location
     */
    buildMongoDatabaseConnectionString: () => string;
}

let isConfigured = false;

/**
 * Returns the configuration object.
 * @param {EnvironmentalConfig} configuration file.
 */
export function get() {
    if (!isConfigured) {
        isConfigured = !isConfigured;
        loadConfiguration();
    }

    return <EnvironmentalConfig> config;
}

/**
 * Builds the given mongo database connection string.
 * @returns {string} Complete connection string to mongodb
 */
export function buildMongoConnection() {
    if (!isConfigured) {
        isConfigured = !isConfigured;
        loadConfiguration();
    }
    
    var connection = "mongodb://";

    if (config.DATABASE_USER && config.DATABASE_PASSWORD) {
        // mongodb://user:password@
        connection += config.DATABASE_USER + ":" + config.DATABASE_PASSWORD + "@";
    }

    // mongodb://user:password@somewhere.com:27012/
    connection += config.DATABASE_URL + ":" + config.DATABASE_PORT + "/";

    if (config.DATABASE_SUFFIX) {
        // mongodb://user:password@somewhere.com:27012/application_specific_database
        connection += "/" + config.DATABASE_SUFFIX;
    }

    console.log("Connection string:", connection);
    return connection;
}

export default get;
