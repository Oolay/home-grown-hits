'use strict';

const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })
const HOME_GROWN_HITS_TABLE = 'homeGrownHitsGames'

async function getGame(gameId) {
    const getParams = {
        TableName: HOME_GROWN_HITS_TABLE,
        Key: {
            'gameId': gameId,
        },
    }

    const { Item } = await documentClient.get(getParams).promise()

    return [Item]
}

async function getGames() {
    const queryParameters = {
        TableName: HOME_GROWN_HITS_TABLE
    }

    const { Items } = await documentClient.scan(queryParameters).promise()

    return Items
}

module.exports.getGamesHandler = async event => {
    console.info(JSON.stringify(event))
    try{
        const { gameId } = event.queryStringParameters || {}

        const games = gameId
            ? await getGame(gameId)
            : await getGames()

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                games,
            }),
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
        }

        return response
    } catch(e) {
        console.error(e)
    }
}
