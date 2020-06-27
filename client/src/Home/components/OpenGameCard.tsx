import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { Paper, Typography } from '@material-ui/core'

import { GameMetaData } from '../../services/getGames'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
    }
})

interface Props {
    playerName: string
    gameMetaData: GameMetaData
    handleJoinGame: () => void
}

const OpenGameCard: React.FC<Props> = ({
    playerName,
    gameMetaData,
    handleJoinGame,
 }) => {
    const classes = useStyles()
    const history = useHistory()

    return (
        <Paper
            elevation={3}
            className={classes.container}
            onClick={handleJoinGame}
        >
            <Typography>
                {`Creator: ${gameMetaData.creator.name}`}
            </Typography>
            <Typography>
                {`Lahd count: ${gameMetaData.players.length}`}
            </Typography>
        </Paper>
    )
}

export default OpenGameCard