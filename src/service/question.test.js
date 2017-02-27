var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import question from './question'
var promise = require('bluebird');

describe('Questions', function() {

    it('getQuestions is a func', function() {
        expect(question.getQuestions).to.be.a('function');
    });

    it('should get questions', function () {
       return question.getQuestions().then(data => {
           expect(data).to.equal([]);
       });
    });

    it('should add question', () => {
        const user = {id : "what"}
        const tags = ['what', 'is']
        const title = "What is happening"
        const content = "why ??? and what yuo want"

        return question.addQuestion(title,content, tags, user ).then(data => expect(data).to.equal(''));
    });

    it('should add 3 question', () => {
        const promises = [];
        for (let i = 0; i < 3 ; i++){
            const authorId = "user" + i
            const tags = ['what', 'is']
            const title = "What is happening this is question " + i;
            const content = "why ??? and what yuo want" + i
            promises.push(question.addQuestion(title,content, tags, authorId ).then(data => expect(data).to.equal('')));
        }

        return promise.all(promises)
    });

    it('should get a question', () => {
        return question.getAQuestion("df96ee83-0b15-42cd-bebc-9d5e6cb19a29")
            .then(question => expect(question).to.equal(''));
    });

    it('should get by a user id', () => {
        return question.getQuestionsByUser("what").then(question => expect(question).to.equal(''));
    });

    it("should get questions by time created", () => {
        return question.getMostRecentQuestions()
            .then(questions => {
                return questions;
            })
            .then(questions => expect(questions).to.equal(''));
    });
});