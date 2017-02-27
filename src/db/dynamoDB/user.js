import userSchema from './schema/user_schema'
import db from './dynamodb'
const answerDB = db(userSchema.TableName)

export default {
    getUser: function(id) {
        return answerDB.getItem({id})
    },
    addUser: function (user) {
        user.id = uuid.v4();
        user.reputation = 0;
        user.followers = [];

        return answerDB.save(user).then(() => user);
    },
    getUserByExternalId(externalId){
        return answerDB.getItem({id});
    }
}