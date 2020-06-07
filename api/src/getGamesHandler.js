'use strict';

const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-08' })

function getGames() {
    const queryParameters = {
        TableName: 'homeGrownHitsGames'
    }

    return documentClient.scan(queryParameters).promise()
}

module.exports.getGamesHandler = async event => {
    console.info(JSON.stringify(event))
    try{
        const games = await getGames()

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                games: games.Items,
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
