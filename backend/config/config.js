
var configuration = require("./config.json");

/** @type {Object} Exposed configuration object that will be built from config.json and environmental variables.  */
var config = { };

Object.keys(configuration).forEach(function(property) {
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
        config[property] = value;
    }
});

// NOTE I'm fully aware that if someone makes a config.json variable with the same name, it gets overwritten - but that's
//      just plain silly - let's not even go there - that would mean it wouldn't work with the common process.env.variable
//      either...

config.buildMongoDatabaseConnectionString = function() {
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
};

module.exports = config;