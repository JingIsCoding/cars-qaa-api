import couchbase from 'couchbase';
import config from './config';
import Promise from 'bluebird';

const cluster = new couchbase.Cluster('couchbase://' + config.host + ":" + config.port);
const bucket = cluster.openBucket(config.bucket, function (err, success) {
    if (err){
        console.log(err);
        return;
    }
});
const client = Promise.promisifyAll(bucket);
export const bucketName = config.bucket;
export const SearchQuery = couchbase.SearchQuery;
export const  N1qlQuery = couchbase.N1qlQuery;
export default client;