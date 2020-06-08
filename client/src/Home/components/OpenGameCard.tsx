import React from 'react'
import { makeStyles } from '@material-ui/styles'

import { Paper, Typography } from '@material-ui/core'

import { Player } from '../../services/setGame'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
    }
})

interface Props {
    creator: Player
    players: Player[]
}

const OpenGameCard: React.FC<Props> = ({ creator, players }) => {
    const classes = useStyles()

    return (
        <Paper elevation={3} className={classes.container}>
            <Typography>
                {`Creator: ${creator.name}`}
            </Typography>
            <Typography>
                {`Lahd count: ${players.length}`}
            </Typography>
        </Paper>
    )
}

export default OpenGameCard