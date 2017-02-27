var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
import Select from './select'

describe.only('Select', function() {

    it("should construct select", () => {
        const select = new Select("default");
        expect(select).to.be.defined;
    })

    it("should set type", () => {
        const select = new Select("default").onType("question");
        expect(select.bucketName).to.equal("default");
        expect(select.type).to.equal("question");
    })

    it("should set attribute", () => {
        const select = new Select("default")
            .onType("question")
            .with("title", "t")
            .with("content", "c")
        expect(select.bucketName).to.equal("default");
        expect(select.type).to.equal("question");
        expect(select.attributes).to.deep.equal([{as: "t", attribute:"title"}, {as: "c", attribute:"content"}]);
    })

    it("should set where clause", () => {
        const select = new Select("default")
            .onType("question")
            .with("title", "t")
            .with("content", "c")
            .that("title").equals("cool")
            .andThat("content").containsString("cool")
            .orThat("tags").has("ok")

        expect(select.bucketName).to.equal("default");
        expect(select.type).to.equal("question");
        expect(select.attributes).to.deep.equal([{as: "t", attribute:"title"}, {as: "c", attribute:"content"}]);

        expect(select.where.conditions[0].condition.field).to.equal('title');
        expect(select.where.conditions[0].condition.comparator).to.equal('=');
        expect(select.where.conditions[0].condition.value).to.equal('cool');
        expect(select.where.conditions[0].condition.operator).to.be.undefined;

        expect(select.where.conditions[1].condition.field).to.equal('content');
        expect(select.where.conditions[1].condition.comparator).to.equal('CONTAINS');
        expect(select.where.conditions[1].condition.value).to.equal('cool');
        expect(select.where.conditions[1].operator).to.equal("AND");

        expect(select.where.conditions[2].condition.field).to.equal('tags');
        expect(select.where.conditions[2].condition.comparator).to.equal('IN');
        expect(select.where.conditions[2].condition.value).to.equal('ok');
        expect(select.where.conditions[2].operator).to.equal("OR");
    })

    it("should generate basic select string", () => {
        const select = new Select("default")
            .onType("question")
            .with("question.title", "t")
            .with("question.content", "c")
        expect(select.toQueryString()).to.equal("SELECT question.title AS t, question.content AS c FROM default question WHERE question.type='question' ")
    })

    it("should generate basic select string that title equals cool", () => {
        const select = new Select("default")
            .onType("question")
            .with("question.title", "t")
            .with("question.content", "c")
            .that("question.title").equals("cool")
        expect(select.toQueryString()).to.equal("SELECT question.title AS t, question.content AS c FROM default question WHERE question.type='question' AND ( question.title = \"cool\")")
    })

    it("should join", () => {
        const select = new Select("default")
            .onType("answer")
            .with("question")
            .with("ARRAY_COUNT(ARRAY_AGG(answer))", "answerSize")
            .join("question")
            .onKeys("answer.questionId")
            .groupBy("question")

        expect(select.toQueryString()).to.equal("SELECT question AS question, ARRAY_COUNT(ARRAY_AGG(answer)) AS answerSize FROM default answer JOIN default question ON KEYS answer.questionId WHERE answer.type='answer'  GROUP BY question")
    })

    it("should generate basic select string that title equals cool or views larger than 2", () => {
        const select = new Select("default")
            .onType("question")
            .with("question.title", "t")
            .with("question.content", "c")
            .that("question.title").equals("cool")
            .orThat("question.views").greaterThan(2)
        expect(select.toQueryString()).to.equal("SELECT question.title AS t, question.content AS c FROM default question WHERE question.type='question' AND ( question.title = \"cool\" OR  question.views > 2)")
    })

    it("should generate basic select string that title equals cool or views larger than 2", () => {
        const select = new Select("default")
            .onType("question")
            .with("question.title", "t")
            .with("question.content", "c")
            .that("question.title").containsString("What")
            .andThat("question.views").greaterThan(-1)
            .andThat("question.tags").hasEvery(['what', 'is'])
        expect(select.toQueryString()).to.equal("SELECT question.title AS t, question.content AS c FROM default question WHERE question.type='question' AND (CONTAINS(question.title,\"What\") AND  question.views > -1 AND  EVERY item IN [\"what\",\"is\"] SATISFIES item IN question.tags END )")
    })

    it("should limit and skip", () => {
        const select = new Select("default")
            .onType("question")
            .limit(10)
            .skip(1)
            .orderBy("views", "DESC")
            .orderBy("modifiedTime", "DESC")
        expect(select.toQueryString()).to.equal("SELECT *  FROM default question WHERE question.type='question'  ORDER BY modifiedTime DESC LIMIT 10 OFFSET 1")
    })

})