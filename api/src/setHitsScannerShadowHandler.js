const { handlePromiseAll } = require('./lib/handlePromiseAll')

const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.REGION,
})

const iotData = new AWS.IotData({
    endpoint: process.env.HITS_SCANNER_API_ENDPOINT,
})

function updateHitsShadowState(gameState) {
    const payload = {
        state: {
            desired: {
                gameState,
            },
        }
    }

    const params = {
        payload: JSON.stringify(payload),
        thingName: process.env.HITS_SCANNER_THING_NAME
    }

    return iotData.updateThingShadow(params).promise()
}

module.exports.setHitsScannerShadowHandler = async (event, _context, callback) => {
    console.info('Received event:', JSON.stringify(event, null, 2))

    try {
        const updateShadow = event.Records.reduce((allProcesses, record) => {
            try {
                const data = JSON.parse(record.Sns.Message)

                allProcesses.concat(updateHitsShadowState(data))
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