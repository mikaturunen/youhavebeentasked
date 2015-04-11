var passport = require("passport");
var express = require("express");
var localStrategy = require("passport-local").Strategy;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var bcrypt = require("bcryptjs");

var config = require("../config/config");
var mongo = require("../mongo/mongo");
var user = require("../user/user");

/** MongoDb collection for users. Initialized by module init(). */
var salt = bcrypt.genSaltSync(16);
var userCollection;

/**
 * Handles the passport specific done behavior to resolve into proper Passport state.
 * @param  {User} user Front provided User
 * @param  {User} resultUser Database provided User
 * @param  {boolean} isPassportCall When true, the call to tryFindingUser was made by passport and does not contain password. 
 * @param  {Function} done Callback for Passport.
 * @return {any} Done result.
 */
function passportHandleUser(user, resultUser, isPassportCall, done) {
    // When it's not a call made by passport directly, we need to check password. When passport does the
    // check on deserialization with just username, we need to let it through properly
    if (!resultUser) {
        console.log("No user for handling authentication present.");
        return done(null, false, { message: "Incorrect username or password" });
    }

    if (!isPassportCall) {
        // Called by user invoking it -- check hash
        bcrypt.compare(user.password, resultUser.passwordHash, function(error, isMatch) {
            if (error) {
                console.log("Error in bcrypt compare.", error);
                return done(error);
            }

            if (isMatch) {
                delete resultUser.passwordHash;
                return done(null, resultUser);
            } else {
                return done(null, false, { message: "Incorrect username or password" });
            }
        });
    } else {
        // Called by passport middleware, allow through with no hash 
        delete resultUser.passwordHash;
        return done(null, resultUser);
    }
}

/**
 * Tries finding the user with given User details.
 * @param  {{ username: string; password: string; }} userDocument User object to try and find.
 * @param  {Function} done Done function from passport middleware.
 * @param  {boolean} isPassportCall When true, the call to tryFindingUser was made by passport and does not contain password. 
 * User is logged in and only requires to be checked if the user can be found with the username. Otherwise normal call
 * from frontend and requires password checking.
 * @return {Object} Returned as instructed in Passport configuration guide. 
 */
function tryFindingUser(userDocument, isPassportCall, done) {
    user.getByUsername(userDocument.username)
        .done(
            function(resultUser) {
                passportHandleUser(userDocument, resultUser, isPassportCall, done);
            }, 
            function(error) {
                done(error);
            }
        );
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

var callCounter = 0;
/**
 * Setups authentication and authorization related routes in place for the user.
 * @param  {Express.Application} app Express application
 */
function setupRoutes(app) {
    app.get("/api/login", function(req, res) {
        callCounter += 1;

        if (req.user) {
            tryFindingUser(req.user, true, function(error, user, message) {
                if (error || user === false) {
                    res.status(401).jsonp({ message: "Unauthorized" });
                    return;
                }

                res.status(200).jsonp({ message: "ok" });
            });
        } else {
            res.status(401).jsonp({ message: "Unauthorized" });
        }
    });

    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        console.log("Everything ok in authentication - returning 200 - OK");
        res.status(200).jsonp({ foo: "bar" });
    });
}

/**
 * Authentication module that hides all the strategies and behavior behind it.
 * @module Authenticaton
 */
var authentication = {
    authenticate: function(req, res, callback) {
        if (!req.user) {
            res.status(401).jsonp({ message: "Unauthorized" });
            return;
        }

        callback(req, res);
    },

    init: function(app) {
        setupPassport(app);
        setupMiddlewaresRelatingToPassport(app);
        setupRoutes(app);
    },
};

module.exports = authentication;
