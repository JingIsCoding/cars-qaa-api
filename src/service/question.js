import uuid from 'uuid'
import db from '../db'
import { FLAG_ACCEPT, FLAG_INAPPROPRIATE, FLAG_INVALID, FLAG_IRRELEVENT, STATUS_ACTIVE, STATUS_INACTIVE } from '../constants'
import _ from 'lodash'
import Promise from 'bluebird'

const questionDB = db.questionDB

export default  {
    getQuestions: function(page, pageSize, groupIdentifier) {
        return questionDB.getQuestions(page, pageSize, groupIdentifier);
    },
    getAQuestion: function(id) {
        return questionDB.getAQuestion(id)
    },
    updateQuestion: function(id, title, content, tags){
        const question = {id, title, content, tags}
        question.modifiedTime = new Date().toISOString()
        if (!!title){
            question.friendlyUrl = convertToSlug(title)
        }
        return questionDB.updateQuestion(id, question)
            .catch(err => {
                console.log(err)
                return err
            })
    },
    voteAQuestion: function(id, userId){
        if (!userId){
            return Promise.reject("Have to specify a user")
        }

        return questionDB
            .getAQuestion(id)
            .then(question => {
                if(_.indexOf(question.votes, userId) > -1){
                    question.votes = _.remove(question.votes, userId)
                } else {
                    question.votes.push(userId)
                }
                return question
            })
            .then(question => questionDB.updateQuestion(question.id, question))
    },
    likeAQuestion: function (questionId, userId) {
        if (!userId){
            return Promise.reject("Have to specify a user")
        }
        return this.getAQuestion(questionId)
            .then(question => {
                if(_.indexOf(question.favourites, userId) > -1){
                    question.favourites = _.remove(question.favourites, userId)
                } else {
                    question.favourites.push(userId)
                }
                return question
            })
            .then(question => questionDB.updateQuestion(question.id, question))
    },
    subscribeToQuestion(questionId, userId){
        if (!userId){
            return Promise.reject("Have to specify a user")
        }
        return this.getAQuestion(questionId)
            .then(question => {
                if(_.indexOf(question.favourites, userId) > -1){
                    question.subscriber = _.remove(question.subscriber, userId)
                } else {
                    question.subscriber.push(userId)
                }
                return question
            })
            .then(question => questionDB.updateQuestion(question.id, question))
    },
    deleteQuestion: function (id) {
        return questionDB.deleteQuestion(id)
    },
    getQuestionsByUser: function (authorId, orderBy, order) {
        return questionDB.getQuestionsByUser(authorId, orderBy, order)
    },
    getQuestionsByKeyword: function(keywords, groupIdentifier) {
        return questionDB.getQuestionsByKeyword(keywords)
    },
    getQuestionsByTags: function(tags = [], groupIdentifier) {
        return questionDB.getQuestionsByTags(tags).catch(err => console.log(err))
    },
    getMostRecentQuestions: function(page, pageSize, groupIdentifier){
        return questionDB.getMostRecentQuestions(page, pageSize, groupIdentifier)
    },
    getMostPopularQuestions: function(page, pageSize, groupIdentifier){
        return questionDB.getMostPopularQuestions(page, pageSize, groupIdentifier)
    },
    addQuestion: function(title, content, tags, authorId, groupIdentifier){
        const question = {
            title,
            content,
            tags,
            authorId
        }
        if (!question.authorId){
            return Promise.reject('Have to specify a user for submitting question')
        }
        question.id = uuid.v4();
        question.groupIdentifier = groupIdentifier
        //automatic subscribe author
        question.subscriber = [ authorId ];
        question.answers = [];
        question.views = [];
        question.votes = [];
        question.favourites = [];

        question.flag = FLAG_ACCEPT
        question.status = STATUS_ACTIVE

        question.tags = !!question.tags? question.tags : [];
        question.type = "question";

        question.createdTime = new Date().toISOString();
        question.modifiedTime = new Date().toISOString();
        question.friendlyUrl = convertToSlug(question.title);

        return questionDB.addQuestion(question);
    },
    deleteQuestion(id){
        return questionDB.deleteQuestion(id);
    }
}

function convertToSlug(title)
{
    return title
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
}

