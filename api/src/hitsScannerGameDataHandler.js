const { handlePromiseAll } = require('./lib/handlePromiseAll')

const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.REGION,
})

const iotData = new AWS.IotData({
    endpoint: process.env.HITS_SCANNER_API_ENDPOINT,
})

function transformGameDataToDisplay(gameData) {
    try {
        return {
            line1: gameData.hasStarted ? 'Started' : 'Waiting to start...',
            line2: `Player Count: ${gameData.players.length}`
        }
    } catch (error) {
        console.error(error)

        return {
            line1: 'No game started'
        }
    }
}

function publishHitsScannerDisplay(gameData) {
    const params = {
        topic: 'hitsScanner/screenDisplay',
        payload: JSON.stringify(transformGameDataToDisplay(gameData)),
    }

    return iotData.publish(params).promise()
}

module.exports.hitsScannerGameDataHandler = async (event, _context, callback) => {
    console.info('Received event:', JSON.stringify(event, null, 2))

    try {
        const updateShadow = event.Records.reduce((allProcesses, record) => {
            try {
                const data = JSON.parse(record.Sns.Message)

                allProcesses.concat(publishHitsScannerDisplay(data))
            } catch (error) {
                console.error(`Handle SNS records error: ${error.message}`)
            }

            return allProcesses
        }, [])

        await handlePromiseAll(updateShadow, 'Handle hits scanner shadow update')

        callback(null)
    } catch (e) {
        throw new Error(`hits scanner shadow update error: ${error.message}`)
    }
}