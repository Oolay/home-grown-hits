'use strict';

const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })
const connectionTableName = 'homeGrownHitsConnections'

function saveConnection(connectionId, gameId) {
    const putParams = {
        TableName: connectionTableName,
        Item: {
            connectionId,
            gameId,
        }
    }

    return documentClient.put(putParams).promise()
}

function removeConnection({ connectionId, gameId }) {
    const deleteParams = {
        TableName: connectionTableName,
        Key: {
            connectionId,
            gameId,
        }
    }

    return documentClient.delete(deleteParams).promise()
}

module.exports.connectionManager = async event => {
    console.info('event', JSON.stringify(event))
    try {
        const { gameId } = event.queryStringParameters
        const { connectionId } = event.requestContext

        if (event.requestContext.eventType === 'CONNECT') {
            await saveConnection(connectionId, gameId)

            return {
                statusCode: 200,
                body: 'Connected',
            }
        } else {
            await removeConnection(connectionId, gameId)

            return {
                statusCode: 200,
                body: 'Disconnected',
            }
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: `connectionManager error: ${error.message}`,
        }
    }
}
