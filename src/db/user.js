import db from './dynamodb'
import uuid from 'uuid'
import userSchema from './schema/user_schema'
const client = db(userSchema)
const Promise = require("bluebird");

module.exports = {
    getUser: function(id) {
        return client.getItem({id})
    },
    addUser: function (user) {
        user.id = uuid.v4();
        user.reputation = 0;
        user.followers = [];

        return client.save(user).then(() => user);
    },
    getUserByExternalId(externalId){
        return client.getItem({id});
    }
}
