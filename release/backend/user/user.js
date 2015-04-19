var mongo = require("../mongo/mongo");
var config = require("../config/config");
var ObjectId = require("mongodb").ObjectId;
var User;
(function (User) {
    function collection() {
        var userCollection;
        return (function () {
            if (!userCollection) {
                userCollection = mongo.collection(config.get().DATABASE_COLLECTION_USER);
            }
            return userCollection;
        })();
    }
    User.collection = collection;
    function getByUsername(username) {
        return mongo.query(User.collection(), "findOne", { username: username });
    }
    User.getByUsername = getByUsername;
    function getById(userId) {
        return mongo.query(User.collection(), "findOne", { _id: new ObjectId(userId) });
    }
    User.getById = getById;
})(User || (User = {}));
module.exports = User;
