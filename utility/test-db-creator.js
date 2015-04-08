var config = require("../backend/config/config");
var mongo = require("../backend/mongo/mongo");

mongo
    .connect()
    .done(function() {
        // populate test database by dropping all docs first
        var collection = mongo.collection(config.DATABASE_COLLECTION_USER);
        
        console.log("Cleaning out mongodb from users");
        collection.remove();

        mongo
            .query(collection, "insert", {
                username: "Admin",
                // Plain text test passsword is: admintest
                // It is completely ok for us to reveal this as this is only for local testing and nothing else. 
                passwordHash: "$2a$10$VSLtI7RQgjpLKEFTdIbcnOd54y5nTilsFx6obMn9n2nBJekFpeuM2"
            })
            .then(function() { 
                return mongo.query(collection, "findOne", { username: "Admin" }); 
            })
            .done(function(response) {
                console.log("Confirmed user:", response);
                console.log("Closing mongo connection..");
                mongo.close();
            });

    }, console.log);

