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

async function getGameIdFromConnectionId(connectionId) {
    const queryParams = {
        TableName: connectionTableName,
        IndexName: 'connectionId-index',
        KeyConditionExpression: [
            'connectionId = :connectionId',
        ].join(' '),
        ExpressionAttributeValues: {
            ':connectionId': connectionId,
        },
    }

    const { Items } = await documentClient.query(queryParams).promise()
    console.info('Items', Items)

    return Items && Items.length
        ? Items[0].gameId
        : undefined
}

async function removeConnection(connectionId) {
    // Can only delete on primary key, so query for the connections gameId (primary key)
    const gameId = await getGameIdFromConnectionId(connectionId)

    const deleteParams = {
        TableName: connectionTableName,
        Key: {
            gameId,
            connectionId,
        }
    }

    return documentClient.delete(deleteParams).promise()
}

module.exports.connectionManager = async event => {
    console.info('event', JSON.stringify(event))
    try {
        const { gameId } = event.queryStringParameters || {}
        const { connectionId } = event.requestContext

        if (event.requestContext.eventType === 'CONNECT') {
            if (!gameId) {
                throw new Error('Could not find gameId in connection event')
            }
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
