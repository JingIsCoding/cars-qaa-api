import questionSchema from './schema/question_schema'
import db from './dynamodb'
const questionDB = db(questionSchema.TableName)

export default {
    getQuestions: function(page, pageSize) {
        return questionDB.scanItem({}).then(questions => questions.Items)
    },
    getAQuestion: function(id) {
        return questionDB.getItem({
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeNames:{
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":id": id,
            }
        }).then(data => {
            const question = data.Items.length > 0 ? data.Items[0] : null
            if (question){
                question.view = question.view + 1;
                this.updateQuestion(question)
            }
            return question;
        })
    },
    updateQuestion: function(question){
        questionDB.update(question)
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
        const limitResult = limit ? limit : 25;
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
        })
    },
    deleteQuestion : function (id) {

    },
    getQuestionsWithTags: function(tags){

    },
    addQuestion: function(question){
        return questionDB.save(question);
    }
}