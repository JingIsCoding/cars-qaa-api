import uuid from 'uuid'
import db from '../db'
import { FLAG_ACCEPT, FLAG_INAPPROPRIATE, FLAG_INVALID, FLAG_IRRELEVENT, STATUS_ACTIVE, STATUS_INACTIVE } from '../constants'
import questionService from './question'
import _ from 'lodash'
import Promise from 'bluebird'

const questionDB = db.questionDB
const answerDB = db.answerDB

export default {
    updateAnswer: (answerId, content) => {
        return answerDB.updateAnswer(answerId, {content})
    },
    deleteAnswer: (answerId) => {
        return answerDB.deleteAnAnswer(answerId)
    },
    createAnswer: (questionId, authorId, content, replyToId) => {
        const answer = {
            id : uuid.v4(),
            type: "answer",
            authorId,
            questionId: questionId,
            replyTo: replyToId? replyToId : questionId,
            stars: [],
            votes: [],
            flag : FLAG_ACCEPT,
            status : STATUS_ACTIVE,
            createdTime : new Date().toISOString(),
            modifiedTime : new Date().toISOString(),
            content
        }

        return questionDB.getAQuestion(questionId)
            .then(question =>{
                question.answers.unshift(answer.id)
                questionDB.updateQuestion(question.id, question)
            })
            .then(question => answerDB.createAnswer(answer))
            .catch(err => {
                console.log(err)
                return err
            })
    },
    voteAnswer:(answerId, userId) => {
        return answerDB.get
    }
}