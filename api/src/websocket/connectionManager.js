'use strict';

const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })
const connectionTableName = 'homeGrownHitsConnections'

function saveConnection(connection, gameId) {
    const putParams = {
        TableName: connectionTableName,
        Item: {
            connectionId: connection.connectionId,
            gameId,
        }
    }

    return documentClient.put(putParams).promise()
}

function removeConnection({ connectionId }) {
    const deleteParams = {
        TableName: connectionTableName,
        Key: {
            connectionId,
        }
    }

    return documentClient.delete(deleteParams).promise()
}

module.exports.connectionManager = async event => {
    console.info('event', JSON.stringify(event))
    try {
        if (event.requestContext.eventType === 'CONNECT') {
            const { gameId } = event.queryStringParameters

            const connection = {
                connectionId : event.requestContext.connectionId,
            }

            console.log('gameId', gameId, 'connectionId', event.requestContext.connectionId)

            await saveConnection(connection, gameId)

            return {
                statusCode: 200,
                body: 'Connected',
            }
        } else {
            await removeConnection(event.requestContext.connectionId)

            return {
                statusCode: 200,
                body: 'Disconnected',
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: `connectionManager error: ${error.message}`,
        }
    }
}
