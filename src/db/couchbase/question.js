import client, { N1qlQuery, SearchQuery, bucketName } from './client'
import Promise from 'bluebird'
import Select from './query/select'
import { FLAG_ACCEPT, FLAG_INAPPROPRIATE, FLAG_INVALID, FLAG_IRRELEVENT, STATUS_ACTIVE, STATUS_INACTIVE } from '../../constants'

export default {
    getQuestions: function(page, pageSize = 50, orderBy = 'question.modifiedTime', order= 'DESC', groupIdentifier) {
        return new Promise((resolve, reject) => {
            const queryObj = new Select(bucketName)
                .onType("question")
                .that('question.status').equals(STATUS_ACTIVE)
                .orderBy(orderBy, order)
                .limit(pageSize)
                .skip((page - 1) * pageSize);

            const query = N1qlQuery.fromString(queryObj.toQueryString());
            return client.query(query, (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toQuestion))
            });
        })
    },
    getAQuestion: function(id) {
        const queryObj = new Select(bucketName)
            .onType("question")
            .that("question.id").equals(id)
            .andThat('question.status').equals(STATUS_ACTIVE)
            .leftNest("answers")
            .onKey("answers.questionId")
            .for("question")

        const query = N1qlQuery.fromString(queryObj.toQueryString());

        return client.queryAsync(query)
            .then(records => {
                console.log(client)
                if (!records || records.length === 0){
                    throw new Error("Can not find question")
                }
                const question = records[0].question;
                question.answers = records[0].answers ? records[0].answers : []
                return question
            })
    },
    updateQuestion: function(id, question){
        return new Promise(function (resolve, reject) {
            const mutate = client.mutateIn(id)
            for (let key in question){
                if (!!question[key]){
                    mutate.upsert(key, question[key], true)
                }
            }
            mutate.execute((error, result) => {
                if(error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    },
    getQuestionsByUser: function (authorId, page = 1, pageSize = 50, orderBy = 'question.modifiedTime', order= 'DESC') {
        const queryObj = new Select(bucketName)
            .onType("question")
            .that("question.authorId").equals(authorId)
            .andThat('question.status').equals(STATUS_ACTIVE)
            .orderBy(orderBy, order)
            .limit(pageSize)
            .skip((page - 1) * pageSize)

        const query = N1qlQuery.fromString(queryObj.toQueryString());

        return new Promise((resolve, reject) => {
            client.query(query, (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toQuestion))
            })
        }).catch(err => {
            console.log(err);
            return err;
        })

    },
    getQuestionsByKeyword: function(keywords, page = 1, pageSize = 50, orderBy = 'question.modifiedTime', order= 'DESC', groupIdentifier) {
        const queryObj = new Select(bucketName)
            .onType("question")
            .that("question.status").equals(STATUS_ACTIVE)
            .andThat("question.content").containsString(keywords)
            .orderBy(orderBy, order)
            .limit(pageSize)
            .skip((page - 1) * pageSize)

        if (groupIdentifier){
            queryObj.andThat("question.groupIdentifier").equals(groupIdentifier)
        }

        return new Promise((resolve, reject) => {
            client.query(N1qlQuery.fromString(queryObj.toQueryString()), (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toQuestion))
            })
        }).catch(err => {
            console.log(err);
            return err;
        })
    },
    getQuestionsByTags: function(tags, page = 1, pageSize = 50, orderBy = 'question.modifiedTime', order= 'DESC', groupIdentifier){
        const queryObj = new Select(bucketName)
            .onType("question")
            .that("question.status").equals(STATUS_ACTIVE)
            .andThat("question.tags").hasEvery(tags)
            .orderBy(orderBy, order)
            .limit(pageSize)
            .skip((page - 1) * pageSize)

        if (groupIdentifier){
            queryObj.andThat("question.groupIdentifier").equals(groupIdentifier)
        }

        return new Promise((resolve, reject) => {
            return client.query(N1qlQuery.fromString(queryObj.toQueryString()), (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toQuestion))
            });
        })
    },
    getMostRecentQuestions: function(page = 1, pageSize = 50, groupIdentifier){
        pageSize = pageSize > 50 ? 50 : pageSize
        return new Promise((resolve, reject) => {
            const queryObj = new Select(bucketName)
                .onType("question")
                .that('status').equals(STATUS_ACTIVE)
                .orderBy("modifiedTime", "DESC")
                .limit(pageSize).skip((page - 1) * pageSize)

            if (groupIdentifier){
                queryObj.andThat("question.groupIdentifier").equals(groupIdentifier)
            }

            return client.query(N1qlQuery.fromString(queryObj.toQueryString()), (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toQuestion))
            });
        })
    },
    getMostPopularQuestions: function (page = 1, pageSize = 50, groupIdentifier) {
        pageSize = pageSize > 50 ? 50 : pageSize
        return new Promise((resolve, reject) => {
            const queryObj = new Select(bucketName)
                .onType("question")
                .that('question.status').equals(STATUS_ACTIVE)
                .orderBy("question.views", "DESC")
                .limit(pageSize)
                .skip((page - 1) * pageSize)

            if (groupIdentifier){
                queryObj.andThat('question.groupIdentifier').equals(groupIdentifier)
            }

            return client.query(N1qlQuery.fromString(queryObj.toQueryString()), (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toQuestion))
            });
        })
    },
    disableQuestion: function (id) {
        return this.updateQuestion(id, {status: STATUS_INACTIVE})
    },
    deleteQuestion : function (questionId) {
        return client.getAsync(questionId)
            .then(record => {
                const question = record.value
                question.answers.forEach(answerId => client.removeAsync(answerId))
            })
            .then(() => client.removeAsync(questionId))
    },
    addQuestion: function(question){
        return client.insertAsync(question.id, question)
            .then(() => question)
            .catch(err => {
                console.log(err);
                return err;
            })
    }
}

function toQuestion(record) {
    const data = record[bucketName];
    if (!data){
        return record
    }
    data.id = record.id;
    return data;
}