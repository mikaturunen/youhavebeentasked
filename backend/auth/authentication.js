var passport = require("passport");
var express = require("express");
var localStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cookieSession = require("cookie-session");

// TODO move away from plain text passwords and move them into the database asap when the testing is done 
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

    if (users[user.username] === undefined || users[user.username].password !== user.password) {
        return done(null, false, { message: "Incorrect username or password" });
    }

    return done(null, users[user.username]);
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
 * Setups the passport module itself for authentication and authorization use.
 * @param  {Express.Application} app Express application
 */
function setupPassport(app) {
    passport.use(getConfiguration());
    passport.serializeUser(userSerialization);
    passport.deserializeUser(userDeSerialization);
}

/**
 * Setups all the Middleware used in conjuction with the authentication/authorization.
 * @param  {Express.Application} app Express application
 */
function setupMiddlewaresRelatingToPassport(app) {
    // Configuring required express middlewares in place
    app.use(bodyParser.json({
        extended: true
    }));
    app.use(cookieParser());
    app.use(cookieSession({ 
        // TODO read this from environmental variable / configuration - for now it's ok to be here as we have
        //      no real users or anything
        secret: "~46:h.]^H#h5%)HgT0O5{Tfm97hw1Y"
    }));

    // Express based application, we'll reroute the passport middlewares in place
    app.use(passport.initialize());
    app.use(passport.session());
}

/**
 * Setups authentication and authorization related routes in place for the user.
 * @param  {Express.Application} app Express application
 */
function setupRoutes(app) {
    app.post("/api/login", function(req, res) {
        console.log("/api/login called - user attempting to login.");
        console.log(req.body);

        tryFindingUser(req.body.user, function(error, user, message) {
            // NOTE tryFindingUser is not wrapped in Promise as the callback is passport specific callback,
            //      here we are just taking advantage of the existing behavior
            if (error || user === false) {
                console.log("Error finding user");
                // These are the two conditions that are specified in passport documents for failing cases; when user
                // is false or when there is an error message present. 
                // Forbidden with message.
                res.status(403).jsonp(message);
            } else {
                console.log("User found!", user);
                // User allowed in.
                res.json(user);           
            } 
        });
    });
}

/**
 * Authentication module that hides all the strategies and behavior behind it.
 * @module Authenticaton
 */
var authentication = {
    init: function(app) {
        setupPassport(app);
        setupMiddlewaresRelatingToPassport(app);
        setupRoutes(app);
    }
};

module.exports = authentication;
