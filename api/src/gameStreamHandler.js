
const AWS = require('aws-sdk')
const { handlePromiseAll } = require('./lib/handlePromiseAll')

// Initialize AWS SNS
AWS.config.update({
    region: process.env.REGION,
})
const sns = new AWS.SNS()



const pushSNSWebSocketEvent = (event) => {
    const params = {
        TargetArn: process.env.GAME_SNS_TOPIC_ARN,
        Message: JSON.stringify(event),
    }

    return sns.publish(params).promise()
}

module.exports.gameStreamHandler = (event, _context, callback) => {
    console.info('Received event:', JSON.stringify(event, null, 2))

    try {
        const events = event.Records.reduce((acc, record) => {
            if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
                const unmarshalledNewImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)

                acc.push(unmarshalledNewImage)

                return acc
            }

            return acc
        }, [])

        return handlePromiseAll(
            events.map(pushSNSWebSocketEvent),
            'Game stream handler'
        )
    } catch (e) {
        throw new Error(`gameStream error: ${error.message}`)
    }
}