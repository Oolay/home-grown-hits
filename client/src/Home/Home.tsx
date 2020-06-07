import React, { useState, ChangeEvent } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import {
    TextField,
    Button,
    Typography,
} from '@material-ui/core'

import { setGame } from '../services/setGame'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    createButton: {
        marginTop: '16px',
    }
})

const Home: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const [playerName, setPlayerName] = useState<string>('')

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
            >
                Create Game
            </Button>
        </div>
    )
}

export default Home
