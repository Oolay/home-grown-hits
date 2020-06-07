
import moment, { Moment } from 'moment'

import { backOff } from './backOff'

// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
const NORMAL_CLOSURE_CODE = 1000

export const INTENTIONAL_CLOSURE_CODE = NORMAL_CLOSURE_CODE

const BACK_OFF_OPTIONS = {}

const formatUtcIsoString = (momentObj?: Moment) => {
    const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

    return momentObj
        ? momentObj.utc().format(ISO_FORMAT)
        : moment().utc().format(ISO_FORMAT)
}

export interface SubscriptionMessageEvents {
    hitsEvent: {
        data: any
        topic: 'hitsEvent'
    }
}

export type Message = SubscriptionMessageEvents[keyof SubscriptionMessageEvents]


export interface Subscribers {
    [key: string]: Function[]
}

export interface ConnectionChangeEvent {
    type: 'connectionChangeEvent'
    connected: boolean
    disconnectionTimestamp: string | null
    disconnectionCode?: number
}

export function isConnectionChangeEvent(
    event: ConnectionChangeEvent | Record<any, any>,
): event is ConnectionChangeEvent {
    return event.type === 'connectionChangeEvent'
}

export class SubscriptionStore {
    public connected = false

    public initialise(gameId: string) {
        this.gameId = gameId
        this.connect()
        if (this.hasSubscribers) {
            // this.connect()
        }
    }

    /**
     * Subscribe to a topic, given callback will be called for any message for topic
     * as well as any websocket connection change event (disconnect/connect).
     */
    public subscribe<T extends keyof SubscriptionMessageEvents>(
        subscriptionName: T,
        callback: (payload: SubscriptionMessageEvents[T]['data'] | ConnectionChangeEvent) => void,
    ) {
        if (!this.subscribers[subscriptionName]) {
            this.subscribers[subscriptionName] = []
        }

        this.subscribers[subscriptionName].push(callback)

        if (!this.connected) {
            this.connect()
        }

        return {
            unsubscribe: () => {
                const index = this.subscribers[subscriptionName].indexOf(callback)

                this.subscribers[subscriptionName].splice(index, 1)
            },
        }
    }

    /**
     * Intentionally close the websocket connection, all subscriptions will persist.
     */
    public closeConnection() {
        if (this.ws) {
            this.ws.close(INTENTIONAL_CLOSURE_CODE)
        }
    }

    public ws: WebSocket | null = null
    private subscribers: Subscribers = {}
    private websocketEndpoint = 'wss://6iudpel5n1.execute-api.ap-southeast-2.amazonaws.com/dev'
    private token: string | null = null
    private doExpBackOff = backOff(BACK_OFF_OPTIONS)
    private disconnectionTimestamp: string | null = null
    private gameId: string | null = null

    private get hasTokenExpired() {
        // No expirations atm
        return false
    }

    private connect = () => {
        try {
            const shouldConnect = !this.ws
                || this.ws.readyState === WebSocket.CLOSED

            if (shouldConnect) {
                console.info('connecting to ws...')
                this.ws = new WebSocket(`${this.websocketEndpoint}?gameId=${this.gameId}`)

                this.ws.onerror = this.handleError
                this.ws.onmessage = this.handleOnMessage
                this.ws.onopen = this.handleConnectionOpened
                this.ws.onclose = this.handleConnectionClosed
            }
        } catch (e) {
            console.error('Could not establish a ws connection')
        }
    }

    private handleError = (event: Event) => {
        console.error('ws connection error', event.type)
    }

    private handleConnectionOpened = () => {
        console.info('ws connected')
        this.setConnected({ connected: true })

        this.resetExpBackOff()
    }

    private handleConnectionClosed = (event: CloseEvent) => {
        console.info('ws connection closed', event.code, event.reason)

        this.setConnected({
            connected: false,
            disconnectionCode: event.code,
        })

        // Reconnect WebSocket if token is not expired or connection is not closed intentionally.
        const intentionalSocketClose = event.code === INTENTIONAL_CLOSURE_CODE
        const shouldReconnect = !this.hasTokenExpired && !intentionalSocketClose

        if (shouldReconnect) {
            this.doExpBackOff(this.connect)
        } else {
            this.ws = null
        }
    }

    private handleOnMessage = (messageEvent: MessageEvent) => {
        const message = JSON.parse(messageEvent.data)

        this.publishMessage('hitsEvent', message)
    }

    private publishMessage = (subscriptionTopic: keyof SubscriptionMessageEvents, data: Message['data']) => {
        if (!this.subscribers[subscriptionTopic]) {
            return
        }

        this.subscribers[subscriptionTopic].forEach(subscriberCallback =>
            subscriberCallback(data))
    }

    private resetExpBackOff() {
        this.doExpBackOff = backOff(BACK_OFF_OPTIONS)
    }

    private setConnected({ connected, disconnectionCode }: { connected: boolean, disconnectionCode?: number }) {
        const connectionChanged = connected !== this.connected

        if (connectionChanged) {
            this.connected = connected
            this.notifySubscribersOfConnectionChange({
                connected,
                disconnectionTimestamp: this.disconnectionTimestamp,
                disconnectionCode,
            })
        }

        this.disconnectionTimestamp = this.connected
            ? null
            : formatUtcIsoString()
    }

    private notifySubscribersOfConnectionChange({
        connected,
        disconnectionTimestamp,
        disconnectionCode,
    }: { connected: boolean,
        disconnectionTimestamp: string | null
        disconnectionCode?: number
    }) {
        Object.values(this.subscribers).forEach((eventSubscribers) => {
            if (Array.isArray(eventSubscribers)) {
                eventSubscribers.forEach((subscriberCb) => {
                    subscriberCb({
                        type: 'connectionChangeEvent',
                        connected,
                        disconnectionTimestamp,
                        disconnectionCode,
                    })
                })
            }
        })
    }

    // private get hasConnectionCredentials() {
    //     return !!(this.token && this.websocketEndpoint)
    // }

    private get hasSubscribers() {
        return Object.values(this.subscribers)
            .some((eventSubscribers: Function[]) => Array.isArray(eventSubscribers) && !!eventSubscribers.length)
    }
}

const instance = new SubscriptionStore()

export default instance
