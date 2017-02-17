// tests/part1/cart-summary-test.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var question = require('./question');
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
        const q = {
            category: "general",
            user: {id : "what"},
            title: "What is happening",
            content: "why ??? and what yuo want",
            contentType: "text"
        }
        return question.addQuestion(q).then(data => expect(data).to.equal(q));
    });

    it.only('should add 20 question', () => {
        const promises = [];
        for (let i = 1; i < 21 ; i++){
            const q = {
                category: "general",
                user: {id : "what"},
                title: "1",
                content: "why ??? and what yuo want",
                contentType: "text"
            }
            q.title = "" + i;
            promises.push(question.addQuestion(q));
        }

        return promise.all(promises)
    });

    it('should get a question', () => {
        return question.getAQuestion("9889ca58-ba39-4c5a-8a56-1279ab21bb0b").then(question => expect(question).to.equal(''));
    });

    it('should get by a user id', () => {
        return question.getQuestionsByUser("what").then(question => expect(question).to.equal(''));
    });

    it("should get questions by time created", () => {
        return question.getMostRecentQuestions()
            .then(questions => {
                console.log(questions)
                return questions;
            })
            .then(questions => expect(questions).to.equal(''));
    });
});