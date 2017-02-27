import client, { N1qlQuery, SearchQuery, bucketName } from './client'
import Promise from 'bluebird'
import Select from './query/select'
import { FLAG_ACCEPT, FLAG_INAPPROPRIATE, FLAG_INVALID, FLAG_IRRELEVENT, STATUS_ACTIVE, STATUS_INACTIVE } from '../../constants'

export default {
    getAnAnswer(answerId){
        return client.removeAsync(answerId)
    },
    deleteAnAnswer(answerId){
        return client.removeAsync(answerId)
    },
    getAnswerByQuestion: (questionId, limit) => {
        return new Promise((resolve, reject) => {
            const queryObj = new Select(bucketName)
                .onType("answer")
                .that('answer.questionId').equals(questionId)
                .andThat('answer.status').equals(STATUS_ACTIVE)
                .orderBy(orderBy, order)
                .limit(limit)

            const query = N1qlQuery.fromString(queryObj.toQueryString());
            return client.query(query, (err, records) => {
                if (err){
                    return reject(err)
                }
                return resolve(records.map(toAnswer))
            });
        })
    },
    createAnswer: (answer) => {
        return client.insertAsync(answer.id, answer)
    },
    updateAnswer:(answerId, answer) => {
        return new Promise(function (resolve, reject) {
            const mutate = client.mutateIn(answerId)
            for (let key in answer){
                if (!!answer[key]){
                    mutate.upsert(key, answer[key], true)
                }
            }
            mutate.execute((error, result) => {
                if(error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }
}

function toAnswer(record) {
    
}