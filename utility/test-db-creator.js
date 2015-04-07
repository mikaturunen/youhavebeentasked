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
                // TODO next phase: bcrypt password, initially plain text for testing purposes - I know, stupid but we are 
                //      testing and not going to production so deal with it
                password: "test"
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

