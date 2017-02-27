import db from './dynamodb'
import answerSchema from './schema/answer_schema'
const answerDB = db(answerSchema.TableName)

export default {
    getAnswerByQuestion: (questionId) => {
    },
    createAnswer: (questionId, answer) => {
    },
    voteAnswer:(answer) => {
    }
}