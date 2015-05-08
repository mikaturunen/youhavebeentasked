var config = require("../release/backend/config/config").default;
var mongo = require("../release/backend/mongo/mongo").default;
var Q = require("q");

mongo
    .connect()
    .done(function() {
        // populate test database by dropping all docs first
        var userCollection = mongo.collection(config.DATABASE_COLLECTION_USER);
        var taskCollection = mongo.collection(config.DATABASE_COLLECTION_TASK);
        var teamCollection = mongo.collection(config.DATABASE_COLLECTION_TEAM);

        console.log("Cleaning out mongodb from existing content...");
        userCollection.remove();
        teamCollection.remove();
        taskCollection.remove();

        mongo.query(userCollection, "insert", [
                {
                    username: "Mack",
                    passwordHash: "$2a$10$VSLtI7RQgjpLKEFTdIbcnOd54y5nTilsFx6obMn9n2nBJekFpeuM2"
                },
                {
                    username: "Ben",
                    passwordHash: "$2a$10$VSLtI7RQgjpLKEFTdIbcnOd54y5nTilsFx6obMn9n2nBJekFpeuM2"
                },
                {
                    username: "Steve",
                    passwordHash: "$2a$10$VSLtI7RQgjpLKEFTdIbcnOd54y5nTilsFx6obMn9n2nBJekFpeuM2"
                },
                {
                    username: "Barley",
                    passwordHash: "$2a$10$VSLtI7RQgjpLKEFTdIbcnOd54y5nTilsFx6obMn9n2nBJekFpeuM2"
                }
            ])
            .then(function() {
                return Q.all([
                    mongo.query(userCollection, "findOne", { username: "Mack" }),
                    mongo.query(userCollection, "findOne", { username: "Ben" }),
                    mongo.query(userCollection, "findOne", { username: "Steve" }),
                    mongo.query(userCollection, "findOne", { username: "Barley" })
                ]);
            })
            .then(function(users) {
                return mongo.query(teamCollection, "insert", {
                    name: "Delivery",
                    memberIds: users.map(function(user) { return user._id; }),
                    organizerIds: users[0]._id
                });
            })
            .then(function() {
                return mongo.query(teamCollection, "findOne", {
                    name: "Delivery"
                });
            })
            .then(function(team) {
                return mongo.query(taskCollection, "insert", [
                    {
                        teamId: team._id,
                        title: "Flower delivery",
                        description: "Delivering flowers",
                        plannedEvents: [],
                        actualEvents: [],
                        done: false
                    },
                    {
                        teamId: team._id,
                        title: "Ash delivery",
                        description: "Salting the ground",
                        plannedEvents: [],
                        actualEvents: [],
                        done: false
                    },
                    {
                        teamId: team._id,
                        title: "Flower delivery",
                        description: "",
                        plannedEvents: [],
                        actualEvents: [],
                        done: false
                    },
                    {
                        teamId: team._id,
                        title: "Flower delivery",
                        description: "Something 123",
                        plannedEvents: [],
                        actualEvents: [],
                        done: false
                    }
                ]);
            })
            .done(function(response) {
                console.log("Test database created. \nLogin username: \"Mack\" and password: \"admintest\".");
                mongo.close();
            });

    }, console.log);
