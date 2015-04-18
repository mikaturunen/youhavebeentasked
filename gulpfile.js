"use strict";

/**
 * Gulp usage file for the whole project.
 */

var gulp = require("gulp");
var rename = require("gulp-rename");
var ts = require("gulp-typescript");
var eventStream = require("event-stream");
var jade = require("gulp-jade");
var path = require("path");
var tslint = require("gulp-tslint");
var install = require("gulp-install");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var sequence = require("run-sequence");
var browserify = require("browserify");
var tsify = require("tsify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var copy = require("gulp-copy");

// Declaring some constants for use during the gulp build process. Mainly the locations of certain files and naming
// conventions for more easier access later in the process.

// Definitions explicitly done for this project
var projectDefinitions = [ ];
var fromDefinitelyTypedServer = [
    "definitions/server.d.ts"
];
var fromDefinitelyTypedClient = [
    "definitions/client.d.ts"
];

var typeDefinitionsServer = fromDefinitelyTypedServer
    .concat(projectDefinitions)
    .concat([ "backend/**/*.ts" ]);

var typeDefinitionsClient = fromDefinitelyTypedClient
    .concat(projectDefinitions)
    .concat([ "frontend/**/*.ts" ]);

var jadeLocation = [
    "frontend/**/*.jade"
];

var tmpLocation = "./tmp";

var taskTslintServer = "tslint-server";
gulp.task(taskTslintServer, function() {
    return gulp.src(typeDefinitionsServer).pipe(tslint()).pipe(tslint.report("verbose"));
});

var taskJade = "jade";
gulp.task(taskJade, function() {
    return gulp.src(jadeLocation).pipe(jade()).pipe(gulp.dest(jadeReleaseLocation));
});

var taskTscServer = "ts-server";
gulp.task(taskTscServer, function() {
    var tsServerResult = gulp.src(typeDefinitionsServer)
                            .pipe(ts({
                                declarationFiles: true,
                                noImplicitAny: true,
                                noExternalResolve: false,
                                removeComments: true,
                                target: "ES6",
                                module: "commonjs",
                                showErrors: true
                            }));

    return eventStream.merge(
        tsServerResult.js.pipe(gulp.dest(tmpLocation))
    );
});

var taskCopyClient = "copy-client";
gulp.task(taskCopyClient, function() {
    return gulp.src("./tmp/frontend/**/*.*")
        .pipe(copy("./release/"));
});

// Set of GULP Tasks that are executed on demand

/**
 * Run with: gulp default. 
 * Executes the default task, essentially going through all possible steps.
 */
gulp.task("default", function() {
    sequence(
        [ 
           // taskJade, 
            taskTslintServer 
        ],
        [ 
            taskTscServer 
        ]
    );
});