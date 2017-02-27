var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import Query from './query'

describe('Query', function() {
    it('should construct', () => {
        const query = new Query('default')
        expect(query.toQueryString()).to.equal("SELECT * FROM default;");
    })

    it('should construct on field equals', () => {
        const query = new Query('default')
        query.onType('Question').onField('id').equals(123)
        expect(query.toQueryString()).to.equal("SELECT * FROM default WHERE type=\"Question\" AND ( id = 123 );");
    })

    it('should construct on field equals and another field greater than', () => {
        const query = new Query('default')
        query.onType('Question').onField('id').equals(123).and().onField('name').equals("Jing")
        expect(query.toQueryString()).to.equal("SELECT * FROM default WHERE type=\"Question\" AND ( id = 123 AND name = \"Jing\" );");
    })

    it('should construct on field equals and another field greater than ', () => {
        const query = new Query('default')
        query.onType('Question').onField('id').equals(123).and().onField('age').greaterThan(2)
        expect(query.toQueryString()).to.equal("SELECT * FROM default WHERE type=\"Question\" AND ( id = 123 AND age > 2 );");
    })

    it('should construct on field equals and age greater than or score less than 60', () => {
        const query = new Query('default')
        query.onType('Question').onField('id').equals(123).and().onField('age').greaterThan(2).or().onField('score').lessThan(60)
        expect(query.toQueryString()).to.equal("SELECT * FROM default WHERE type=\"Question\" AND ( id = 123 AND age > 2 OR score < 60 );");
    })

    it('should construct on field equals limit result', () => {
        const query = new Query('default')
        query.onType('Question').onField('id').equals(123).limit(20).skip(20).orderBy("time", "asc")
        expect(query.toQueryString()).to.equal("SELECT * FROM default WHERE type=\"Question\" AND ( id = 123 ) LIMIT 20 OFFSET 20;");
    })

    it('should construct on field contains', () => {
        const query = new Query('default')
        query.onType('Question').onField('tags').contains("ford").limit(20).skip(20)
        expect(query.toQueryString()).to.equal("SELECT * FROM default WHERE type=\"Question\" AND ( \"ford\" IN tags ) LIMIT 20 OFFSET 20;");
    })

    it('should construct on field contains that select field', () => {
        const query = new Query('default')
        query.onType('Question').selectFields(['title', 'content']).onField('tags').contains("ford").limit(20).skip(20)
        expect(query.toQueryString()).to.equal("SELECT title,content FROM default WHERE type=\"Question\" AND ( \"ford\" IN tags ) LIMIT 20 OFFSET 20;");
    })

})