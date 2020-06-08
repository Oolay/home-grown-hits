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

module.exports.joinGameHandler = async event => {
    console.info(JSON.stringify(event))
    try {    
        const { playerName, gameMetaData } = JSON.parse(event.body)
        const playerId = uuidv4()
        const player = {
            name: playerName,
            id: playerId,
        }
    
        const updatedGame = await updatePlayers(gameMetaData, player)

        console.log('updatedGame', updatedGame)
    
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                player: player,
                gameMetaData: updatedGame,
            }),
        }
        
        return response
    } catch(e) {
        console.error(e)
    }
}
