import client from './client'

export default function (schema) {
    const params = {
        TableName: schema.TableName
    };
    return {
        save: (obj) => {
            params.Item = obj;
            return client.putAsync(params);
        },
        getItem: (obj) => {
            params.Key = obj;
            return client.getAsync(params);
        },
        queryItem: (query) => {
            const queryParams = Object.assign({}, query, params)
            return client.queryAsync(queryParams);
        },
        scanItem: (conditions) => {
            const scanParams = Object.assign({}, conditions, params)
            return client.scanAsync(scanParams);
        },
        del: (obj) => {
            params.Key = obj;
            return client.deleteAsync(params);
        },
        batchDel: (query) => {
            let deleteQuery = {
                "RequestItems": {}
            }
            return client.batchWriteItemAsync(deleteQuery);
        },
        update: (obj) => {
            params.Item = obj;
            return client.updateAsync(params);
        }
    }
}

