var passport = require("passport");
var express = require("express");
var localStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");

var users = {
    "admin": {
        id: 1,
        username: "admin",
        password: "test"
    }
};

/**
 * Tries finding the user with given User details.
 * @param  {{ username: string; password: string; }} user User object to try and find.
 * @param  {Function} done Done function from passport middleware.
 * @return {Object} Returned as instructed in Passport configuration guide. 
 */
function tryFindingUser(user, done) {
    // TODO we are NOT going to use plain text passwords or other idiotic details like this - this is just for 
    //      quick testing that we know passport + local strategy are configured correctly and after that 
    //      we can safely swap in a proper authentication

    if (users[username] === undefined || users[username].password !== user.password) {
        return done(null, false, { message: "Incorrect username or password" });
    }

    return done(null, users[username]);
}

/**
 * Gets configuration LocalStrategy configuration for Passport.
 * @return {Object} Configuration object.
 */
function getConfiguration() {
    return new localStrategy(function(username, password, done) {
        return tryFindingUser({
                username: username,
                password: password
            }, done);
    });
}

/**
 * User serialization function. Serializes the user for passport.
 * @param  {User}   user User object to serialize.
 * @param  {Function} done Middleware verification callback for Express and Passport combination
 */
function userSerialization(user, done) {
    done(null, user);
}

/**
 * Attempts to deserialize the user.
 * @param  {User}   user User to try and deserialize.
 * @param  {Function} done Middleware verification callback for Express and Passport combination
 */
function userDeSerialization(user, done) {
    tryFindingUser(user, done);
}

/**
 * Authentication module that hides all the strategies and behavior behind it.
 * @module Authenticaton
 */
var authentication = {
    init: function(app) {
        passport.use(getConfiguration());
        passport.serializeUser(userSerialization);
        passport.deserializeUser(userDeSerialization);

        // Configuring required express middlewares in place
        app.use(bodyParser.json({
            extended: true
        }));
        app.use(cookieParser());
        app.use(cookieSession({ 
            secret: "~46:h.]^H#h5%)HgT0O5{Tfm97hw1Y"
        }));

        // Express based application, we'll reroute the passport middlewares in place
        app.use(passport.initialize());
        app.use(passport.session());
    }
};

module.exports = authentication;
