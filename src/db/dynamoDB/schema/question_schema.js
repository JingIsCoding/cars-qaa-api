const questionSchema = {
    TableName : "Question",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH"},
        { AttributeName: "createdTime", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "createdTime", AttributeType: "S" },
        { AttributeName: "status", AttributeType: "S" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "userId",
            KeySchema: [
                { AttributeName: "userId", KeyType: "HASH" }
            ],
            Projection: {
                "ProjectionType": "ALL"
            },
            ProvisionedThroughput: {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1
            }
        },
        {
            IndexName: "createdTime",
            KeySchema: [
                { AttributeName: "status", KeyType: "HASH" },
                { AttributeName: "createdTime", KeyType: "RANGE" }
            ],
            Projection: {
                "ProjectionType": "ALL"
            },
            ProvisionedThroughput: {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1
            }
        },
        {
            IndexName: "titleAndContent",
            KeySchema: [
                { AttributeName: "status", KeyType: "HASH" },
                { AttributeName: "title", KeyType: "RANGE" }
            ],
            Projection: {
                "ProjectionType": "ALL"
            },
            ProvisionedThroughput: {
                "ReadCapacityUnits": 1,
                "WriteCapacityUnits": 1
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

export default questionSchema