import db from './dynamodb'
import uuid from 'uuid'
import questionSchema from './schema/question_schema'
const questionDB = db(questionSchema)
const Promise = require("bluebird");

module.exports = {
    getQuestions: function() {
        return questionDB.scanItem({}).then(questions => questions.Items)
    },
    getAQuestion: function(id) {
        return questionDB.queryItem({
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeNames:{
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":id": id,
            }
        }).then(data => data.Items.length > 0 ? data.Items[0] : null)
    },
    getQuestionsByUser: function (userId) {
        return questionDB.queryItem({
            IndexName: "userId",
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames:{
                "#userId": "userId",
            },
            ExpressionAttributeValues: {
                ":userId": userId,
            }
        }).then(data => data.Items)
    },
    getQuestionsByKeyword: function(keyword) {
        return questionDB.queryItem({
            IndexName: "userId",
            KeyConditionExpression: "#category = :category and #userId = :userId",
            ExpressionAttributeNames:{
                "#category": "category",
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":category": "general"
            }
        }).then(data => data.Items)
    },
    getMostRecentQuestions: function(limit, startKey){
        const limitResult = limit ? limit : 1;

        return questionDB.queryItem({
            IndexName: "createdTime",
            KeyConditionExpression: "#status = :status",
            Limit: limitResult,
            ExclusiveStartKey: startKey,
            ExpressionAttributeNames:{
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": "active"
            },
            ScanIndexForward: false
        }).then(data => data.Items)
    },
    getQuestionsWithTags: function(tags){

    },
    addQuestion: function(question){
        if (!question.user){
            return Promise.reject('Have to specify a user for submitting question')
        }
        question.id = uuid.v4();
        question.userId = question.user.id
        delete question.user;

        question.views = 0;
        question.answers = [];
        question.tags = !!question.tags? question.tags : [];
        question.status = "active";
        question.createdTime = new Date().toISOString();
        question.modifiedTime = new Date().toISOString();

        const friendlyUrl = convertToSlug(question.title);
        return questionDB.save(Object.assign({}, question, {friendlyUrl}))
            .then(() => question);
    },
}

function convertToSlug(title)
{
    return title
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

