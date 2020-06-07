import React, { useState, ChangeEvent } from 'react'
import { useHistory } from 'react-router-dom'
import {
    TextField,
    Button,
    Typography,
} from '@material-ui/core'

import { setGame } from '../services/setGame'

const Home: React.FC = () => {
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
        <>
        <TextField
            label='Name'
            value={playerName}
            onChange={handlePlayerNameChange}
        />

        <Button
            disabled={!playerName}
            onClick={handleCreateGame}
        >
            Create Game
        </Button>
        </>
    )
}

export default Home
