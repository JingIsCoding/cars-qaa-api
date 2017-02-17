const questionSchema = {
    TableName : "Answer",
    KeySchema: [
        { AttributeName: "id", KeyType: "HASH"},
        { AttributeName: "questionId", KeyType: "RANGE"},
    ],
    AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "questionId", AttributeType: "S" },
        { AttributeName: "userId", AttributeType: "S" },
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "questionId",
            KeySchema: [
                { AttributeName: "questionId", KeyType: "HASH" }
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
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
};

export default questionSchema