var configuration = require("./config.json");
var config = {};
Object.keys(configuration).forEach(function (property) {
    if (property.slice(0, 2) == "__") {
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
var ConfigurationContainer;
(function (ConfigurationContainer) {
    function get() {
        return config;
    }
    ConfigurationContainer.get = get;
    function buildMongoDatabaseConnectionString() {
        var connection = "mongodb://";
        if (config.DATABASE_USER && config.DATABASE_PASSWORD) {
            connection += config.DATABASE_USER + ":" + config.DATABASE_PASSWORD + "@";
        }
        connection += config.DATABASE_URL + ":" + config.DATABASE_PORT + "/";
        if (config.DATABASE_SUFFIX) {
            connection += "/" + config.DATABASE_SUFFIX;
        }
        console.log("Connection string:", connection);
        return connection;
    }
    ConfigurationContainer.buildMongoDatabaseConnectionString = buildMongoDatabaseConnectionString;
})(ConfigurationContainer || (ConfigurationContainer = {}));
module.exports = ConfigurationContainer;
