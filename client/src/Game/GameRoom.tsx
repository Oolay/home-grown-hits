import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { Typography } from '@material-ui/core'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

import subscriptionStore, { isConnectionChangeEvent } from '../subscriptionStore'
import { getGame, GameMetaData } from '../services/getGames'

const styles = (theme: any) => createStyles({
})

interface State {
    gameData: GameMetaData | null
}

interface ParamProps {
    gameId: string
}

interface Props extends WithStyles, RouteComponentProps<ParamProps> {}

class Game extends React.Component<Props, State> {
    state: State = { gameData: null }
    private unsubscribeGameEvents: (() => void) | null = null

    componentDidMount() {

        const { gameId } = this.props.match.params

        subscriptionStore.initialise(gameId)

        // Store unsubscribe callback
        this.unsubscribeGameEvents = subscriptionStore.subscribe('gameRoom', this.eventHandler).unsubscribe

        if (gameId) {
            this.loadGame(gameId)
        }
    }

    componentWillUnmount() {
        // Remove game data subscription
        if (typeof this.unsubscribeGameEvents === 'function') {
            this.unsubscribeGameEvents()
        }

        // We only support a single websocket connection for a game room, so also disconnect from web socket
        subscriptionStore.closeConnection()
    }

    private get gameId() {
        try {
            return this.props.match.params.gameId
        } catch {
            return ''
        }
    }

    private loadGame = async (gameId: string) => {
        const gameData = await getGame(gameId)

        this.setState({ gameData })
    }

    private eventHandler = (eventData: any) => {
        if (isConnectionChangeEvent(eventData)) {
            return
        }

        if (!eventData) {
            return
        }

        this.setState({ gameData: eventData })
    }

    public render () {
        if (!this.state.gameData) {
            return (
                <Typography>
                    Game id no found
                </Typography>
            )
        }

        return (
            <div>
                <Typography>
                    {this.gameId}
                </Typography>
                {
                    this.state.gameData.players.map(player => (
                        <Typography key={player.id}>
                            {player.name}
                        </Typography>
                    ))
                }
            </div>
        )
    }

}

export default withRouter(withStyles(styles)(Game))
