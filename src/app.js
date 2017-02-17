import { getAllQuestions, getAQuestions } from './routes/question'
import answer from './routes/answer'
import config from '../config'

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.route(getAllQuestions);
server.route(getAQuestions);

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
//
// // respond with "hello world" when a GET request is made to the homepage
// app.get('/', (req, res) => res.send("holy").status(200))
//
// app.use('/question', question)
// app.use('/answer', answer)
//
// export default () => {
//     app.listen(config.port, () => {
//         console.log("Running at port ", config.port)
//     });
// };