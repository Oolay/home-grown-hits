
const AWS = require('aws-sdk')
const { handlePromiseAll } = require('../../lib/handlePromiseAll')

// Initialize AWS SNS
AWS.config.setPromisesDependency(Bluebird)
AWS.config.update({
    region: process.env.REGION,
})
const sns = new AWS.SNS()

const getArn = (topic : string) =>
    `arn:aws:sns:${process.env.REGION}:${process.env.AWS_ACCOUNT_ID}:${process.env.STAGE}-${topic}`

export const pushSNSWebSocketEvent = (event) => {
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
            if (record.eventName === 'INSERT') {
                const unmarshalledNewImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)

                acc.push(unmarshalledNewImage)

                return acc
            }

            return acc
        }, [])

        return handlePromiseAll(
            events.map(pushSNSWebSocketEvent),
            'Handle websocket send'
        )
    } catch (e) {
        throw new Error(`notificationProcessor error: ${error.message}`)
    }
}