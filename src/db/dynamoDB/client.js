import AWS from "aws-sdk";
import config from './config'
import Promise from 'bluebird'

AWS.config.update({
    region: config.region
});

AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: config.credentials_profile});

const client = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());

export default client;
