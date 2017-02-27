var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import answer from './answer'
var promise = require('bluebird');

describe('Questions', function() {

    it('getQuestions is a func', function() {
        expect(answer.getAnswerByQuestion).to.be.a('function');
    });
    
    it.only("should add a answer", function () {
        return answer.createAnswer("8bc9621e-790c-4762-8e65-14936748e20a", "user-2", "You don't know this????")
            .catch(err => console.log("err", err))
    })
    
});