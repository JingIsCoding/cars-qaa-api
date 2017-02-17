const userSchema =  {
    AttributeDefinitions: [
        {
            AttributeName: "Id",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "Id",
            KeyType: "HASH"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: "Tag"
};

export default userSchema