
require('dotenv').config()

const DynamoDB = require('aws-sdk/clients/dynamodb') // Install the sdk in dev deps only as it is already available and only require the clients all for better cold start performance
const DocumentClient = new DynamoDB.DocumentClient()

const Chance = require('chance')
const chance = new Chance()

const { USERS_TABLE } = process.env

module.exports.handler = async (event) => {
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
        const name = event.request.userAttributes['name']
        const suffix = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true })
        const screenName = `${name.replace(/[^a-zA-Z0-9]/g, "")}${suffix}` // The user can change the screenName
        const user = {
            id: event.userName,
            name,
            screenName,
            createdAt: new Date().toJSON(),
            followersCount: 0,
            followingCount: 0,
            tweetsCount: 0,
            likesCount: 0
        }

        await DocumentClient.put({
            TableName: USERS_TABLE,
            Item: user,
            ConditionExpression: 'attribute_not_exists(id)'
        }).promise()

        return event // Always return the event object for Cognito Triggers????
    } else {
        return event
    }
}

