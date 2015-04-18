import passport = require("passport");
import express = require("express");
var passportLocal = require("passport-local");
import cookieParser = require("cookie-parser");
import bodyParser = require("body-parser");
import session = require("express-session");
import bcrypt = require("bcryptjs");

var config = require("../config/config");
var mongo = require("../mongo/mongo");
var user = require("../user/user");

var localStrategy = passportLocal.Strategy;

/** MongoDb collection for users. Initialized by module init(). */
var salt = bcrypt.genSaltSync(16);
var userCollection: any;

/**
 * Handles the passport specific done behavior to resolve into proper Passport state.
 * @param  {User} user Front provided User
 * @param  {User} resultUser Database provided User
 * @param  {boolean} isPassportCall When true, the call to tryFindingUser was made by passport and does not contain password. 
 * @param  {Function} done Callback for Passport.
 * @return {any} Done result.
 */
// TODO update User once its defined
function passportHandleUser(
        user: any, 
        resultUser: any, 
        isPassportCall: boolean, 
        done: any
    ) {

    // When it's not a call made by passport directly, we need to check password. When passport does the
    // check on deserialization with just username, we need to let it through properly
    if (!resultUser) {
        console.log("No user for handling authentication present.");
        return done(null, false, { message: "Incorrect username or password" });
    }

    if (!isPassportCall) {
        // Called by user invoking it -- check hash
        bcrypt.compare(user.password, resultUser.passwordHash, (error: any, isMatch: boolean) => {
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
// TODO update User once its defined
function tryFindingUser(
        userDocument: any, 
        isPassportCall: boolean, 
        done: any
    ) {

    user.getByUsername(userDocument.username)
        .done(
            // TODO type user once it's done
            (resultUser: any) => {
                passportHandleUser(userDocument, resultUser, isPassportCall, done);
            }, 
            // ToDO use custom error
            (error: any) => {
                done(error);
            }
        );
}

/**
 * Gets configuration LocalStrategy configuration for Passport.
 * @return {Object} Configuration object.
 */
function getConfiguration() {
    return <any> new localStrategy((username: string, password: string, done: any) => {
            return <any> tryFindingUser({
                username: username,
                password: password
            }, 
            false, 
            done);
    });
}

/**
 * User serialization function. Serializes the user for passport.
 * @param  {User}   user User object to serialize.
 * @param  {passportLocal.VerifyFunction} done Middleware verification callback for Express and Passport combination
 */
// TODO update User once its defined
function userSerialization(
        user: any, 
        done: any
    ) {

    done(null, user);
}

/**
 * Attempts to deserialize the user.
 * @param  {User}   user User to try and deserialize.
 * @param  {passportLocal.VerifyFunction} done Middleware verification callback for Express and Passport combination
 */
// TODO update User once its defined
function userDeSerialization(
        user: any, 
        done: any
    ) {

    tryFindingUser(user, true, done);
}

/**
 * Setups the passport module itself for authentication and authorization use.
 * @param  {Express.Application} app Express application
 */
function setupPassport(app: express.Application) {
    passport.use(getConfiguration());
    passport.serializeUser(userSerialization);
    passport.deserializeUser(userDeSerialization);
}

/**
 * Setups all the Middleware used in conjuction with the authentication/authorization.
 * @param  {Express.Application} app Express application
 */
function setupMiddlewaresRelatingToPassport(app: express.Application) {
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

// TODO remove call counter, useless - was used to catch an early bug
var callCounter = 0;
/**
 * Setups authentication and authorization related routes in place for the user.
 * @param  {Express.Application} app Express application
 */
function setupRoutes(app: express.Application) {
    app.get("/api/login", (req: UserRequest, res: express.Response) => {
        callCounter += 1;

        if (req.user) {
            // TODO tuse user
            tryFindingUser(req.user, true, (error: any, user: any, message: any) => {
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

    app.post("/api/login", passport.authenticate("local"), (req: express.Request, res: express.Response) => {
        console.log("Everything ok in authentication - returning 200 - OK");
        res.status(200).jsonp({ foo: "bar" });
    });

    app.get("/api/logout", (req: express.Request, res: express.Response) => {
        if (req.logout !== undefined) {
            req.logout();
        }
        
        res.redirect("/");
    });
}

/**
 * Authentication module that hides all the strategies and behavior behind it.
 * @module Authenticaton
 */
var Authentication = {
    // TODO type properly
    /**
     * Authenticate user.
     * @param {UserRequest} req Express Request that has User information attached to it
     * @param {express.Response} res Express response
     * @param {any} callback Callback to call once authenticated.
     */
    authenticate: (
            req: UserRequest, 
            res: express.Response, 
            callback: (req: UserRequest, res: express.Response) => void
        ) => {

        if (!req.user) {
            res.status(401).jsonp({ message: "Unauthorized" });
            return;
        }

        callback(req, res);
    },

    /**
     * Initialize the authentication
     * @param {express.Application} app Express application.
     */
    init: (app: express.Application) => {
        setupPassport(app);
        setupMiddlewaresRelatingToPassport(app);
        setupRoutes(app);
    },
};

export = Authentication;
