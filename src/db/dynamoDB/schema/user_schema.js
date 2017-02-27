const userSchema =  {
    AttributeDefinitions: [
        {
            AttributeName: "userId",
            AttributeType: "S"
        },
        {
            AttributeName: "externalId",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "userId",
            KeyType: "HASH"
        },
        {
            AttributeName: "externalId",
            KeyType: "RANGE"
        }
    ],
    GlobalSecondaryIndexes: [
    {
        IndexName: "externalId",
        KeySchema: [
            { AttributeName: "externalId", KeyType: "HASH" }
        ],
        Projection: {
            "ProjectionType": "ALL"
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }
],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: "User"
};

export default userSchema