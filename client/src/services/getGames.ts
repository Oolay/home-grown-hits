import { api } from './api'

const HITS_GAMES_URL = `${api}/hits-games`

interface Player {
    name: string
    id: string
}

export interface GameMetaData {
    gameId: string
    timestamp: string
    creator: Player
    players: Player[]
    hasStarted: boolean
}

export async function getGame(gameId: string): Promise<GameMetaData>{
    const [gameData] = await getGames(gameId)

    return gameData
}

export async function getGames(gameId?: string): Promise<GameMetaData[]> {
    try {
        const url = gameId
            ? `${HITS_GAMES_URL}/${gameId}`
            : HITS_GAMES_URL

        const resp = await fetch(url, {
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