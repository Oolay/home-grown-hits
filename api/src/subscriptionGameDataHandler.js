
const AWS = require('aws-sdk')
const { handlePromiseAll } = require('./lib/handlePromiseAll')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })
const connectionTableName = 'homeGrownHitsConnections'

const apiGateway = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: process.env.SUBSCRIPTION_WS_ENDPOINT,
})

async function getWebSocketConnections(gameId) {
    const queryParams = {
        TableName: connectionTableName,
        KeyConditionExpression: [
            'gameId = :gameId',
        ].join(' '),
        ExpressionAttributeValues: {
            ':gameId': gameId,
        },
        ScanIndexForward: true,
    }
    const queryOutput = await documentClient.query(queryParams).promise()

    return (queryOutput.Items || [])
}

function sendDataToWebsocketConnection(connectionId, data) {
    return apiGateway
        .postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(data) })
        .promise()
        .catch (error => console.error(`Send error: connection id: ${connectionId}, error message: ${error.message}.`))
}

async function publishGameDataToSubscribers(gameData) {
    const { gameId } = gameData
    // Get all websocket connections for gameId
    const connections = await getWebSocketConnections(gameId)
    const connectionIds = connections.map(c => c.connectionId)

    console.info('sending to connectionIds:', ...connectionIds)

    // Add game data into structure expected by client
    const event = {
        topic: 'gameRoom',
        data: gameData,
    }

    // Send the data to all the connections
    return handlePromiseAll(
        connectionIds.map(id => sendDataToWebsocketConnection(id, event)),
        'Handle websocket send'
    )
}


module.exports.subscriptionGameDataHandler = async (event, _context, callback) => {
    console.info('Received event:', JSON.stringify(event, null, 2))

    try {
        const publishGameData = event.Records.reduce((allProcesses, record) => {
            try {
                const data = JSON.parse(record.Sns.Message)

                allProcesses.concat(publishGameDataToSubscribers(data))
            } catch (error) {
                console.error(`Handle SNS records error: ${error.message}`)
            }

            return allProcesses
        }, [])

        await handlePromiseAll(publishGameData, 'Handle hits scanner shadow update')

        callback(null)
    } catch (error) {
        throw new Error(`hits subscription publish error: ${error.message}`)
    }
}