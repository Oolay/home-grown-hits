
module.exports.defaultMessage = (event, _context, callback) => {
    console.info('Received event:', JSON.stringify(event, null, 2))

    callback(null)
}