import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import { Paper, Typography } from '@material-ui/core'

import playerStore from '../../stores/playerStore'

import { Player } from '../../services/setGame'
import { GameMetaData } from '../../services/getGames'
import { joinGame } from '../../services/joinGame'
import { leaveGame } from '../../services/leaveGame'
import getOtherJoinedGames from '../../utils/getOtherJoinedGames'

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
        const joinedGames = await getOtherJoinedGames(gameMetaData.gameId)

        if (joinedGames.length > 0) {
            setShowJoinWarning(true)
            playerStore.setJoinedGames(joinedGames)

            return
        }

        handleJoinGame()
    }

    const handleJoinWarningJoin = async () => {
        const playerName = localStorage.getItem('playerName')
        const playerId = localStorage.getItem('playerId')

        const player = {
            id: playerId,
            name: playerName,
        } as Player

        await Promise.all(
            playerStore.joinedGames.map(gameMetaData => leaveGame(player, gameMetaData))
        )

        setShowJoinWarning(false)
        handleJoinGame()
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