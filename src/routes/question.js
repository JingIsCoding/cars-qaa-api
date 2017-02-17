import questionDB from '../db/question'

export const getAllQuestions = {
    method: 'GET',
    path: '/questions',
    handler: function (request, reply) {
        questionDB
            .getQuestions(questions => reply(questions))
    }
}

export const getAQuestion = {
    method: 'GET',
    path: '/questions/{questionId}',
    handler: function (request, reply) {
        const id = request.params.questionId;
        questionDB.getAQuestion(id)
            .then(question => reply(question))
            .catch(reply('Can not find question').code(400))
    }
}