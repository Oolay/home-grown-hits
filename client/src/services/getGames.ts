import { api } from './api'
import { Player } from './setGame'

const getOpenGamesUrl = `${api}/hits-games`

export interface GameMetaData {
    gameId: string
    timestamp: string
    creator: Player
    players: Player[]
    hasStarted: boolean
}

export async function getGames(): Promise<GameMetaData[]> {
    try {
        const resp = await fetch(getOpenGamesUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
        })

        const { games } = await resp.json()

        return games
    } catch(e) {
        console.error(e)

        return []
    }
}