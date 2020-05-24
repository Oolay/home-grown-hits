'use strict';

const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })
const connectionTableName = 'homeGrownHitsConnections'

function saveConnection(gameId, connection) {
    const putParams = {
        TableName: connectionTableName,
        Item: {
            gameId,
            connectionId: connection.connectionId
        }
    }

    return documentClient.put(putParams).promise()
}

function removeConnection(gameId, connection) {
    const deleteParams = {
        TableName: connectionTableName,
        Key: {
            connectionId,
        }
    }

    return documentClient.delete(deleteParams).promise()
}

module.exports.connectionManager = async event => {
    try {
        if (event.requestContext.eventType === 'CONNECT') {
            const connection = {
                connectionId : event.requestContext.connectionId,
            }

            await saveConnection(connection)

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
