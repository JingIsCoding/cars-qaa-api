import answerService from '../service/answer'
import Joi from 'joi'

export const postAnAnswer = {
    method: 'POST',
    path: '/answer/',
    config: {
        description: 'Add an answer to a particular question or can reply to another answer',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                content: Joi.string().required(),
                questionId : Joi.string().required(),
                authorId : Joi.string().required(),
                answerId : Joi.string()
            }
        },
        handler: function (request, reply) {
            const { questionId, content, authorId, replyToId } = request.payload;
            answerService.createAnswer(questionId, authorId, content, replyToId)
                .then((answer) => reply(answer))
                .catch(err => reply(err).code(402))
        }
    }
}

export const updateAnAnswer = {
    method: 'PUT',
    path: '/answer/',
    config: {
        description: 'Update an answer',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                answerId: Joi.string().required(),
                content: Joi.string().required(),
                authorId : Joi.string().required()
            }
        },
        handler: function (request, reply) {
            const { answerId, content, authorId } = request.payload;
            answerService.updateAnswer(answerId, content)
                .then(answer => reply(answer))
                .catch(err => reply(err).code(402))
        }
    }
}

export const deleteAnAnswer = {
    method: 'DELETE',
    path: '/answer/',
    config: {
        description: 'Delete an answer',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                answerId: Joi.string().required(),
                authorId : Joi.string().required()
            }
        },
        handler: function (request, reply) {
            const { answerId, authorId } = request.payload;
            answerService.deleteAnswer(answerId)
                .catch(err => reply(err).code(402))
        }
    }
}

export const voteAnAnswer = {
    method: 'POST',
    path: '/answer/vote',
    config: {
        description: 'Vote an answer',
        tags: [
            'api'
        ],
        validate: {
            payload: {
                answerId: Joi.string().required(),
                authorId : Joi.string().required()
            }
        },
        handler: function (request, reply) {
            const { answerId, authorId } = request.payload;
            answerService.voteAnswer(answerId, authorId)
                .catch(err => reply(err).code(402))
        }
    }
}