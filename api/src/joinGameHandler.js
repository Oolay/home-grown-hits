'use strict';

const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

function updatePlayers(gameMetaData, player) {
    const putParams = {
        TableName: 'homeGrownHitsGames',
        Key: {
            'gameId': gameMetaData.gameId,
            'timestamp': gameMetaData.timestamp,
        },
        UpdateExpression: 'SET #attrName = list_append(#attrName, :attrValue)',
        ExpressionAttributeNames: {
            '#attrName': 'players',
        },
        ExpressionAttributeValues: {
            ':attrValue': [player]
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

module.exports.joinGameHandler = async event => {
    console.info(JSON.stringify(event))

    try {    
        const { playerDetails, gameMetaData } = JSON.parse(event.body)

        const game = await hasGameStarted(gameMetaData)

        if (game && game.hasStarted) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    status: 'gameStarted',
                    player: null,
                    gameMetaData,
                }),
            }
        }

        const isPlayerInGame = checkIfPlayerInGame(playerDetails.id, gameMetaData)

        if (isPlayerInGame) {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    status: 'alreadyInGame',
                    player: playerDetails,
                    gameMetaData,
                }),
            }
        }

        const playerId = uuidv4()
        const player = {
            name: playerDetails.name,
            id: playerId,
        }
    
        const updatedGame = await updatePlayers(gameMetaData, player)
    
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                status: 'joinedGame',
                player,
                gameMetaData: updatedGame,
            }),
        }
        
        return response
    } catch(e) {
        console.error(e)
    }
}
