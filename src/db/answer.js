import db from './dynamodb'

export default {
    getAnswerByQuestion: (question) => {},
    createAnswer: (question, answer) => {},
    voteAnswer:(answer) => {
        answer.vote();
        db.save(answer)
    }
}