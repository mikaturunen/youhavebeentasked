"use strict";

var passport = require("passport");
var passportLocal = require("passport-local");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var bcrypt = require("bcryptjs");
var user = require("../user/user");
var localStrategy = passportLocal.Strategy;
var salt = bcrypt.genSaltSync(16);
var userCollection;
function passportHandleUser(user, resultUser, isPassportCall, done) {
    if (!resultUser) {
        console.log("No user for handling authentication present.");
        return done(null, false, { message: "Incorrect username or password" });
    }
    if (!isPassportCall) {
        bcrypt.compare(user.password, resultUser.passwordHash, function (error, isMatch) {
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
        delete resultUser.passwordHash;
        return done(null, resultUser);
    }
}
function tryFindingUser(userDocument, isPassportCall, done) {
    user.getByUsername(userDocument.username).done(function (resultUser) {
        passportHandleUser(userDocument, resultUser, isPassportCall, done);
    }, function (error) {
        done(error);
    });
}
function getConfiguration() {
    return new localStrategy(function (username, password, done) {
        return tryFindingUser({
            username: username,
            password: password
        }, false, done);
    });
}
function userSerialization(user, done) {
    done(null, user);
}
function userDeSerialization(user, done) {
    tryFindingUser(user, true, done);
}
function setupPassport(app) {
    passport.use(getConfiguration());
    passport.serializeUser(userSerialization);
    passport.deserializeUser(userDeSerialization);
}
function setupMiddlewaresRelatingToPassport(app) {
    app.use(cookieParser());
    app.use(bodyParser.json({
        extended: true
    }));
    app.use(session({
        secret: "~46:h.]^H#h5%)HgT0O5{Tfm97hw1Y",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}
var callCounter = 0;
function setupRoutes(app) {
    app.get("/api/login", function (req, res) {
        callCounter += 1;
        if (req.user) {
            tryFindingUser(req.user, true, function (error, user, message) {
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
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        console.log("Everything ok in authentication - returning 200 - OK");
        res.status(200).jsonp({ foo: "bar" });
    });
    app.get("/api/logout", function (req, res) {
        if (req.logout !== undefined) {
            req.logout();
        }
        res.redirect("/");
    });
}
var Authentication = {
    authenticate: function authenticate(req, res, callback) {
        if (!req.user) {
            res.status(401).jsonp({ message: "Unauthorized" });
            return;
        }
        callback(req, res);
    },
    init: function init(app) {
        setupPassport(app);
        setupMiddlewaresRelatingToPassport(app);
        setupRoutes(app);
    } };
module.exports = Authentication;