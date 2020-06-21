import React from 'react'
import { makeStyles } from '@material-ui/styles'
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
    playerId: string
    gameMetaData: GameMetaData
}

const Huddle: React.FC<Props> = ({
    playerId,
    gameMetaData,
 }) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            {gameMetaData.players.map(player => <Typography>{player.name}</Typography>)}
        </div>
    )
}

export default Huddle