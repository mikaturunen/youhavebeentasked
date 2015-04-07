
var configuration = require("./config.json");

/** @type {Object} Exposed configuration object that will be built from config.json and environmental variables.  */
var config = { };

Object.keys(configuration).forEach(function(property) {
    var value = configuration[property];

    if (process.env[property] !== "" && process.env[property] !== null && process.env[property] !== undefined) {
        value = process.env[property];
    }

    console.log("Config key value:", property, value);
    config[property] = value;
});

module.exports = config;