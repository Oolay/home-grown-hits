import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { Paper, Typography } from '@material-ui/core'

import { GameMetaData } from '../../services/getGames'
import { joinGame } from '../../services/joinGame'

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
}

const OpenGameCard: React.FC<Props> = ({
    playerName,
    gameMetaData,
 }) => {
    const classes = useStyles()
    const history = useHistory()

    const handleGameCardClick = async () => {
        const playerId = localStorage.getItem('playerId')

        const player = {
            id: playerId,
            name: playerName,
        }

        const joinGameResp = await joinGame(player, gameMetaData)

        if (joinGameResp.data && joinGameResp.data.player) {
            const { player } = joinGameResp.data

            localStorage.setItem('playerId', `${player && player.id}`)

            history.push(`/${gameMetaData.gameId}`)
        }
    }

    return (
        <Paper
            elevation={3}
            className={classes.container}
            onClick={handleGameCardClick}
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