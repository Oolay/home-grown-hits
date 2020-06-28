'use strict';

const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

function removePlayer(gameMetaData, playerIndex) {
    const putParams = {
        TableName: 'homeGrownHitsGames',
        Key: {
            'gameId': gameMetaData.gameId,
            'timestamp': gameMetaData.timestamp,
        },
        UpdateExpression: 'REMOVE #attrName[:attrValue]',
        ExpressionAttributeNames: {
            '#attrName': 'players',
        },
        ExpressionAttributeValues: {
            ':attrValue': playerIndex
        },
        ReturnValues: 'ALL_NEW',
    }

    return documentClient.update(putParams).promise()
}

async function hasGameStarted(gameMetaData) {
    const getParams = {
        TableName: 'homeGrownHitsGames',
        Key: {
            'gameId': gameMetaData.gameId,
            'timestamp': gameMetaData.timestamp,
        },
    }

    const { Item } = await documentClient.get(getParams).promise()

    return Item
}

function checkIfPlayerInGame(playerId, game) {
    return game.players.some(player => player.id === playerId)
}

module.exports.leaveGameHandler = async event => {
    console.info(JSON.stringify(event))

    try {    
        const { playerDetails, gameMetaData } = JSON.parse(event.body)

        const game = await hasGameStarted(gameMetaData)

        // cannot leave game if game has started
        if (game && game.hasStarted) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    player: null,
                    gameMetaData,
                }),
            }
        }

        const isPlayerInGame = checkIfPlayerInGame(playerDetails.id, gameMetaData)

        if (!isPlayerInGame) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    player: playerDetails,
                    gameMetaData,
                }),
            }
        }

        const playerIndex = game.players.findIndex(player => player.id === playerDetails.playerId)
    
        const updatedGame = await removePlayer(gameMetaData, playerIndex)
    
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                player,
                gameMetaData: updatedGame,
            }),
        }
        
        return response
    } catch(e) {
        console.error(e)
    }
}
