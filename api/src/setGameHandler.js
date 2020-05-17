'use strict';

const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

function saveGame(gameId) {
    const timestamp = new Date().valueOf()

    const putParams = {
        TableName: 'homeGrownHitsGames',
        Item: {
            gameId,
            timestamp,
        },
    }

    return documentClient.put(putParams).promise()
}

module.exports.setGameHandler = async (event, context) => {
    console.info(JSON.stringify(event))

    const gameId = uuidv4()

    return saveGame(gameId)
        .then((_) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    saved: gameId
                }),
            }

            return response
        })
        .catch((e) => console.error(e))
}
