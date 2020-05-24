import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

import subscriptionStore, { isConnectionChangeEvent } from '../subscriptionStore'
import { Typography } from '@material-ui/core'

const styles = (theme: any) => createStyles({
})

interface ParamProps {
    gameId: string
}

interface Props extends WithStyles, RouteComponentProps<ParamProps> {}

class Game extends React.Component<Props> {
    componentDidMount() {
        const { gameId } = this.props.match.params

        subscriptionStore.initialise(gameId)

        subscriptionStore.subscribe('hitsEvent', this.eventHandler)

        if (gameId) {
            this.loadPreviousEvents(gameId)
        }
    }

    private get gameId() {
        try {
            return this.props.match.params.gameId
        } catch {
            return ''
        }
    }

    private loadPreviousEvents = async (gameId: string) => {
        return []
    }

    private eventHandler = (event: any) => {
        if (isConnectionChangeEvent(event)) {
            return
        }

        const { data } = event

        if (!data) {
            return
        }

        // TODO...
        console.log('event', event)
    }

    public render () {
        if (!this.gameId) {
            return (
                <Typography>
                    Game id no found
                </Typography>
            )
        }

        return (
            <Typography>
                {this.gameId}
            </Typography>
        )
    }

}

export default withRouter(withStyles(styles)(Game))
