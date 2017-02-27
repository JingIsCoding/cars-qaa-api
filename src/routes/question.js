import questionService from '../service/question'
import Joi from 'joi'

const ROOT_PATH = '/question'

export const postAQuestion = {
    method: 'POST',
    path: ROOT_PATH,
    config: {
        description: 'Add a question author id is required',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                title: Joi.string().required(),
                content : Joi.string().required(),
                authorId : Joi.string().required(),
                groupIdentifier : Joi.string(),
                tags: Joi.array()
            }
        },
        handler: function (request, reply) {
            const { title, content, tags, authorId, groupIdentifier } = request.payload
            questionService.addQuestion(title, content, tags, authorId, groupIdentifier)
                .then((question) => reply(question).code(200))
                .catch((err) => reply("failed:" + err).code(402))
        }
    }
}

export const deleteAQuestion = {
    method: 'DELETE',
    path: ROOT_PATH,
    config: {
        description: 'Delete a question',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                questionId : Joi.string().required()
            }
        },
        handler: function (request, reply) {
            const { questionId } = request.payload
            questionService.deleteQuestion(questionId)
                .then(() => reply("ok").code(200))
                .catch((err) => reply("failed:" + err).code(402))
        }
    }
}

export const updateAQuestion = {
    method: 'PUT',
    path: ROOT_PATH,
    config: {
        description: 'Update a question from user input',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                questionId: Joi.string().required(),
                title: Joi.string(),
                content : Joi.string(),
                userId : Joi.string(),
                tags: Joi.array()
            }
        },
        handler: function (request, reply) {
            // var params = request.query
            const questionId = request.payload.questionId
            const title = request.payload.title
            const content =   request.payload.content
            const tags = request.payload.tags

            questionService.updateQuestion(questionId, title, content, tags)
                .then(() => reply("ok").code(200))
                .catch(() => reply("failed").code(402))
        }
    }
}

export const getMostRecentQuestions = {
    method: 'GET',
    path: ROOT_PATH + '/most-recent',
    config: {
        description: 'Get most recent question based on modified time, can specify a group identifier to retrieve a certain group of questions',
        tags: [
            'api'
        ],
        validate: {
            query: {
                groupIdentified: Joi.string(),
                page: Joi.number(),
                pageSize: Joi.number(),
            }
        },
        handler: function (request, reply) {
            const { page, pageSize }= request.query
            questionService.getMostRecentQuestions(page, pageSize).then(questions => {
                reply(questions)
            })
        }
    }
}

export const getMostPopularQuestions = {
    method: 'GET',
    path: ROOT_PATH + '/most-popular',
    config: {
        description: 'Get most popular question based on views, can specify a group identifier to retrieve a certain group of questions',
        tags: [
            'api'
        ],
        validate: {
            query: {
                groupIdentified: Joi.string(),
                page: Joi.number(),
                pageSize: Joi.number(),
            }
        },
        handler: function (request, reply) {
            const { page, pageSize }= request.query
            questionService.getMostPopularQuestions(page, pageSize).then(questions => {
                reply(questions)
            })
        }
    }
}

export const getAllQuestions = {
    method: 'GET',
    path: ROOT_PATH,
    handler: function (request, reply) {
        const { page, pageSize }= request.query
        questionService.getQuestions(page, pageSize).then(questions => reply(questions))
    }
}

export const getAQuestion = {
    method: 'GET',
    path: ROOT_PATH + '/{questionId}',
    config:{
        validate: {
        query: {
            questionId: Joi.string(),
            }
        },
        handler: function (request, reply) {
            const questionId = request.params.questionId;

            questionService.getAQuestion(questionId)
                .then(question => reply(question))
                .catch(err => reply('Can not find question').code(404))
        }
    }
}

export const getQuestionsByUser = {
    method: 'GET',
    path: ROOT_PATH + '/author/{authorId}',
    config:{
        validate: {
            query: {
                authorId: Joi.string(),
                orderBy: Joi.string(),
                order: Joi.string()
            }
        },
        handler: function (request, reply) {
            const authorId = request.params.authorId;
            const orderBy = request.query.orderBy
            const order = request.query.order
            questionService.getQuestionsByUser(authorId, orderBy, order)
                .then(questions => reply(questions))
                .catch(err => reply('Can not find question').code(400))
        }
    }
}

export const getQuestionsByKeyword = {
    method: 'POST',
    path: ROOT_PATH + '/keyword',
    config: {
        description: 'try to do text matching of keywords on question title and content',
        tags: [
            'api'
        ],
        validate: {
            payload:{
                keywords : Joi.string()
            },
            query: {
                groupIdentified: Joi.string(),
                page: Joi.number(),
                pageSize: Joi.number(),
            }
        },
        handler: function (request, reply) {
            const { keywords } = request.payload;
            const orderBy = request.query.orderBy
            const order = request.query.order

            questionService.getQuestionsByKeyword(keywords, orderBy, order)
                .then(questions => reply(questions))
                .catch(err => reply('Can not find question').code(400))
        }
    }
}

export const getQuestionsByTag = {
    method: 'POST',
    path: ROOT_PATH + '/tag',
    config: {
        description: 'try to retrieve questions based on tags',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                tags: Joi.array(),
            },
            query: {
                groupIdentified: Joi.string(),
                page: Joi.number(),
                pageSize: Joi.number().max(50),
            }
        },
        handler: function (request, reply) {
            const { tags } = request.payload
            const orderBy = request.query.orderBy
            const order = request.query.order
            questionService.getQuestionsByTags(tags, orderBy, order)
                .then(questions => reply(questions))
                .catch(err => reply('Can not find question').code(400))
        }
    }
}

export const voteQuestion = {
    method: 'POST',
    path: ROOT_PATH + '/vote',
    handler: function (request, reply) {
        const { questionId, userId } = request.payload
        questionService.voteAQuestion(questionId, userId)
            .then(questions => reply(questions))
            .catch(err => reply('Failed:' + err).code(400))
    }
}

export const likeQuestion = {
    method: 'POST',
    path: ROOT_PATH + '/like',
    handler: function (request, reply) {
        const { questionId, userId } = request.payload
        questionService.likeAQuestion(questionId, userId)
            .then(questions => reply(questions))
            .catch(err => reply('Failed:' + err).code(400))
    }
}