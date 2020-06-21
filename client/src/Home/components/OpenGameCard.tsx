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

        // if someone joins a game that they are already in - just send them in with existing id
        if (gameMetaData.players.some(player => player.id === playerId)) {
            // TODO handle a playerName change -> need to update player in player list and creator name
            history.push(`/${gameMetaData.gameId}`)
        } else {
            const joinGameResp = await joinGame(playerName, gameMetaData)

            if (joinGameResp.data) {
                const { player, updatedGameMetaData: { gameId } } = joinGameResp.data
    
                localStorage.setItem('playerId', `${player.id}`)
    
                history.push(`/${gameId}`)
            }
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