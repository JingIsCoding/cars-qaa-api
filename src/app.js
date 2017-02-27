import { voteQuestion, likeQuestion, getMostRecentQuestions, getMostPopularQuestions, getQuestionsByKeyword, getQuestionsByTag, postAQuestion, deleteAQuestion, updateAQuestion, getAllQuestions, getAQuestion, getQuestionsByUser } from './routes/question'
import { postAnAnswer, updateAnAnswer, deleteAnAnswer, voteAnAnswer } from './routes/answer'
import answer from './routes/answer'
import config from '../config'

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: config.PORT, host: 'localhost' });

//question routes
server.route(postAQuestion);
server.route(voteQuestion);
server.route(likeQuestion);
server.route(deleteAQuestion);
server.route(updateAQuestion);
server.route(getAllQuestions);
server.route(getMostRecentQuestions);
server.route(getMostPopularQuestions);
server.route(getQuestionsByKeyword);
server.route(getQuestionsByTag);
server.route(getAQuestion);
server.route(getQuestionsByUser);

//answers
server.route(postAnAnswer);
server.route(updateAnAnswer);
server.route(voteAnAnswer);
server.route(deleteAnAnswer);

server.register([require('vision'), require('inert'), { register: require('lout') }], function(err) {
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});