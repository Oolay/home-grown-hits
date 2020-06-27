import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { Paper, Typography } from '@material-ui/core'

import { GameMetaData } from '../../services/getGames'
import { joinGame } from '../../services/joinGame'
import checkIfPlayerInAnotherGame from '../../utils/checkIfPlayerInAnotherGame'

import JoinGameDialog from './JoinGameDialog'

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
    const [showJoinWarning, setShowJoinWarning] = useState<boolean>(false)

    const handleJoinGame = async () => {
        const playerId = localStorage.getItem('playerId')

        const playerDetails = {
            id: playerId,
            name: playerName,
        }

        const joinGameResp = await joinGame(playerDetails, gameMetaData)

        if (!joinGameResp.data) {
            return
        }

        const { status, player } = joinGameResp.data

        if (status === 'alreadyInGame' || status === 'gameStarted') {
            history.push(`/${gameMetaData.gameId}`)

            return
        }

        localStorage.setItem('playerId', `${player && player.id}`)
        history.push(`/${gameMetaData.gameId}`)
    }

    const handleGameCardClick = async () => {
        const isPlayerInAnotherGame = await checkIfPlayerInAnotherGame(gameMetaData.gameId)

        if (isPlayerInAnotherGame) {
            setShowJoinWarning(true)

            return
        }

        handleJoinGame()
    }

    const handleJoinWarningJoin = () => {
        // TODO leave other game

        handleJoinGame()
        setShowJoinWarning(false)
    }

    const onJoinWarningCancel = () => {
        setShowJoinWarning(false)
    }

    return (
        <>
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
            <JoinGameDialog
                isOpen={showJoinWarning}
                onJoin={handleJoinWarningJoin}
                onCancel={onJoinWarningCancel}
            />
        </>
    )
}

export default OpenGameCard