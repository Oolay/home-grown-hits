'use strict';

const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

function saveGame(gameId, creator) {
    const timestamp = new Date().valueOf()

    const putParams = {
        TableName: 'homeGrownHitsGames',
        Item: {
            gameId,
            timestamp,
            creator,
            players: [creator],
            hasStarted: false,
        },
    }

    return documentClient.put(putParams).promise()
}

module.exports.setGameHandler = async event => {
    console.info(JSON.stringify(event))

    const gameId = uuidv4()

    const { creatorName } = JSON.parse(event.body)
    const creatorId = uuidv4()
    const creator = {
        name: creatorName,
        id: creatorId,
    }

    return saveGame(gameId, creator)
        .then((_) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    gameId,
                    player: creator,
                }),
            }

            return response
        })
        .catch((e) => console.error(e))
}
