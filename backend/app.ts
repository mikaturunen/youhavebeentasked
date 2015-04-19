
/// <reference path="../typedefinitions/server.d.ts"/>

import express = require("express");
import path = require("path");
import authentication = require("./auth/authentication");
import mongo = require("./mongo/mongo");
import restifiedTaskRoutes = require("./REST/tasks");

// Making sure we have a proper database connection in place
mongo
    .connect()
    .done(
        () => {
            var app = express();

            // TODO update front target
            app.use("/public", express.static(path.join(__dirname, "..", "/frontend")));

            authentication.init(app);
            // Initialize all REST routes
            restifiedTaskRoutes.init(app);

            // Rest of the pages get index.html and 404 will be handled on the front 
            var indexLocation = path.join(__dirname, "..", "/frontend/index.html");
            app.get("*", (req: any, res: any) => {
                res.sendFile(indexLocation);
            });

            // Start the server
            var server = app.listen(3000, () => {
                var host = server.address().address;
                var port = server.address().port;

                console.log("Example app listening at http://%s:%s", host, port);
            });
        }, 
        console.log
    );
