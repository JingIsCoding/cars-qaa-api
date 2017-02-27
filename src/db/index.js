import config, {DYNAMODB, COUCHBASE} from '../../config'
console.error(COUCHBASE)
let daos;
if (config.db === DYNAMODB){
    daos = require('./dynamoDB');
} else if (config.db === COUCHBASE){
    daos = require('./couchbase');
} else {
    console.error("Please specify a database")
}

export default daos;