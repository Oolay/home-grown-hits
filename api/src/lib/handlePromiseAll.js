const handlePromiseSuccess = (promise) =>
    promise.then((result) => ({
        error: false,
        response: result
    }))

const handlePromiseError = (promise) =>
    promise.catch((error) => ({
        error: true,
        response: error
    }))

module.exports.handlePromiseAll = (promises, message) =>
    Promise.all(
        promises
            .map(handlePromiseSuccess)
            .map(handlePromiseError)
    ).then((results) => {
        const successResults = results.filter(result => !result.error)
        const errorResult = results.filter(result => result.error)

        if (successResults.length) {
            console.info(`${message} success: ${JSON.stringify(successResults, null, 2)}`)
        }
        if (errorResult.length) {
            console.error(`${message} error: ${JSON.stringify(errorResult, null, 2)}`)
        }

        return results
    }).catch((error) => {
        console.error(`Handle promise all error: ${error.message}`)
    })
