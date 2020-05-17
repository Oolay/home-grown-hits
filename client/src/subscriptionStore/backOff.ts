const INITIAL_MAX_TIME = 5000
const BACK_OFF_MAX_TIME = 50000
const BASE = 2
const MAX_ATTEMPTS = Infinity

function calculateBackOff({
    initialCallMaxTime,
    backOffTimeMax,
    attempts,
}: {
    initialCallMaxTime: number
    backOffTimeMax: number
    attempts: number
}) {
    if (initialCallMaxTime === 0 || backOffTimeMax === 0) {
        return 0
    }

    // Maximum delay
    let backOffCeiling = initialCallMaxTime * (BASE ** attempts)

    // Check that we don't go over the cap
    backOffCeiling = Math.min(backOffCeiling, backOffTimeMax)

    // Back off time is a random integer between 0 and the calculated back off time
    return Math.floor(Math.random() * backOffCeiling)
}

export interface Options {
    maxAttempts?: number
    /**
     * max time of the initial backOff call (milliseconds)
     */
    initialCallMaxTime?: number
    /**
    * max backOff time (milliseconds)
    */
    backOffTimeMax?: number
}

export function backOff({
    maxAttempts = MAX_ATTEMPTS,
    initialCallMaxTime = INITIAL_MAX_TIME,
    backOffTimeMax = BACK_OFF_MAX_TIME,
}: Options) {
    let attempts = 0

    return (fn: (attempts?: number) => void) => {
        if (attempts <= maxAttempts) {
            // Return timeout so it can be cleared externally, if needed.
            return setTimeout(() => {
                attempts += 1
                fn(attempts)
            }, calculateBackOff({ initialCallMaxTime, backOffTimeMax, attempts }))
        }

        // Return false when we're done attempting
        return false
    }
}
