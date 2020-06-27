import React, { useState, useEffect, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import {
    TextField,
    Button,
} from '@material-ui/core'

import { getGames, GameMetaData } from '../services/getGames'
import { setGame } from '../services/setGame'
import { joinGame } from '../services/joinGame'

import checkPlayerCurrentlyInGame from '../utils/checkPlayerCurrentlyInGame'

import OpenGameCardList from './components/OpenGameCardList'
import JoinGameDialog from './components/JoinGameDialog'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    createButton: {
        marginTop: '2rem',
        marginBottom: '2rem',
    }
})

const Home: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const [playerName, setPlayerName] = useState<string>(localStorage.getItem('playerName') || '')
    const [openGames, setOpenGames] = useState<GameMetaData[]>([])

    useEffect(() => {
        const fetchOpenGames = async () => {
            const allGames = await getGames()

            setOpenGames(allGames)
        }

        fetchOpenGames()
    }, [])

    const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPlayerName(event.target.value)

        localStorage.setItem('playerName', event.target.value)
    }

    const handleCreateGame = async () => {
        const setGameResp = await setGame(playerName)

        if (setGameResp.data) {
            const { data: { gameId, player } } = setGameResp

            localStorage.setItem('playerId', `${player.id}`)

            history.push(`/${gameId}`)
        }
    }

    const handleJoinGame = (gameMetaData: GameMetaData) => async () => {
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

        // not in the game they are trying to join
        if (checkPlayerCurrentlyInGame()) {
            // show the dialog
        }

        localStorage.setItem('playerId', `${player && player.id}`)
        localStorage.setItem('currentGame', gameMetaData.gameId)

        history.push(`/${gameMetaData.gameId}`)
    }

    return (
        <div className={classes.container}>
            <TextField
                label='Your name'
                value={playerName}
                onChange={handlePlayerNameChange}
                variant='outlined'
            />

            <Button
                className={classes.createButton}
                disabled={!playerName}
                onClick={handleCreateGame}
                variant='outlined'
            >
                Create Game
            </Button>
            <OpenGameCardList playerName={playerName} games={openGames}/>
            <JoinGameDialog />
        </div>
    )
}

export default Home
