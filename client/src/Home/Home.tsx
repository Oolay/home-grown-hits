import React, { useState, useEffect, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import {
    TextField,
    Button,
} from '@material-ui/core'

import { getGames, GameMetaData } from '../services/getGames'
import { setGame } from '../services/setGame'

import OpenGameCardList from './components/OpenGameCardList'

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
    const [playerName, setPlayerName] = useState<string>('')
    const [openGames, setOpenGames] = useState<GameMetaData[]>([])

    useEffect(() => {
        const fetchOpenGames = async () => {
            const allGames = await getGames()
            const openGames = allGames.filter(game => !game.hasStarted)

            setOpenGames(openGames)
        }

        fetchOpenGames()
    }, [])

    const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPlayerName(event.target.value)
    }

    const handleCreateGame = async () => {
        const setGameResp = await setGame(playerName)

        if (setGameResp.data) {
            const { data: { gameId, player } } = setGameResp

            localStorage.setItem('playerId', `${player.id}`)

            history.push(`/${gameId}`)
        }
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
        </div>
    )
}

export default Home
