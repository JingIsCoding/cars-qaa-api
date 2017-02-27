import '../client'
import AWS from "aws-sdk";
import Promise from 'bluebird'
import questionSchema from './question_schema'
import answerSchema from './answer_schema'
import userSchema from './user_schema'

const dynamodb = Promise.promisifyAll(new AWS.DynamoDB());

function createTables() {
    createTable(userSchema)
    createTable(questionSchema)
    createTable(answerSchema)
}

function deleteTables() {
    deleteTable(userSchema)
    deleteTable(questionSchema)
}

function deleteTable(schema) {
    console.log("delete table... ", schema.TableName);
    dynamodb.deleteTableAsync(schema)
        .then(() => console.log("successfull deleted.. ", schema.TableName))
        .catch(err => console.log("Failed on delete table ", schema.TableName + " REASON: "+ err))
}

function createTable(schema) {
    console.log("create table... ", schema.TableName);
    dynamodb.createTableAsync(schema)
        .then(() => console.log("successfull created.. ", schema.TableName))
        .catch(err => console.log("Failed on create table ", schema.TableName + " REASON: "+ err))
}

// deleteTables();
createTables();