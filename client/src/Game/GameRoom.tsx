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

    componentDidMount() {

        const { gameId } = this.props.match.params

        subscriptionStore.initialise(gameId)

        subscriptionStore.subscribe('gameRoom', this.eventHandler)

        if (gameId) {
            this.loadGame(gameId)
        }
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
