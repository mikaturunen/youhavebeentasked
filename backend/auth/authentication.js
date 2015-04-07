var passport = require("passport");
var express = require("express");
var localStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var config = require("../config/config");
var mongo = require("../mongo/mongo");

/** MongoDb collection for users. Initialized by module init(). */
var userCollection;

/**
 * Tries finding the user with given User details.
 * @param  {{ username: string; password: string; }} user User object to try and find.
 * @param  {Function} done Done function from passport middleware.
 * @param  {boolean} isPassportCall When true, the call to tryFindingUser was made by passport and does not contain password. 
 * User is logged in and only requires to be checked if the user can be found with the username. Otherwise normal call
 * from frontend and requires password checking.
 * @return {Object} Returned as instructed in Passport configuration guide. 
 */
function tryFindingUser(user, isPassportCall, done) {
    // TODO we are NOT going to use plain text passwords or other idiotic details like this - this is just for 
    //      quick testing that we know passport + local strategy are configured correctly and after that 
    //      we can safely swap in a proper authentication

    mongo
        .query(userCollection, "findOne", { username: user.username })
        .done(
            function(resultUser) {
                // When it's not a call made by passport directly, we need to check password. When passport does the
                // check on deserialization with just username, we need to let it through properly
                if (!resultUser || (!isPassportCall && resultUser.password !== user.password)) {
                    // We also make the assumption that if we didn't find anything with the username and the result = null
                    // because of this, we still tell it's incorred username or password
                    return done(null, false, { message: "Incorrect username or password" });
                }

                delete resultUser.password;
                return done(null, resultUser);
            }, 
            function(error) {
                done(error);
            }
        );

    // TODO what about the return done() behavior?
}

/**
 * Gets configuration LocalStrategy configuration for Passport.
 * @return {Object} Configuration object.
 */
function getConfiguration() {
    return new localStrategy(function(username, password, done) {
        return tryFindingUser(
            {
                username: username,
                password: password
            }, 
            false, 
            done
        );
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
    tryFindingUser(user, true, done);
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
    app.use(cookieParser());
    app.use(bodyParser.json({
        extended: true
    }));
    app.use(session({
        secret: "~46:h.]^H#h5%)HgT0O5{Tfm97hw1Y",
        resave: false,
        saveUninitialized: true,
        cookie: { 
            // NOTE https://github.com/expressjs/session
            // For production vs testing for secure cookies on "Cookie options"
            secure: false 
        }
    }));

    // Express based application, we'll reroute the passport middlewares in place.
    // Express session has to be configured before Passport initialize and session so that the serialization/deserialization
    // process happens in correct order.
    app.use(passport.initialize());
    app.use(passport.session());
}

/**
 * Setups authentication and authorization related routes in place for the user.
 * @param  {Express.Application} app Express application
 */
function setupRoutes(app) {
    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        console.log("Everything ok in authentication - returning 200 - OK");
        res.status(200).end();
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

        mongo.connect().done(function() {
            userCollection = mongo.collection(config.DATABASE_COLLECTION_USER);
        });
    }
};

module.exports = authentication;
