import { api } from './api'

const setGameUrl = `${api}/hits-games`

export interface Player {
    name: string
    id: string
}

interface SetGameResp {
    data: {
        gameId: string
        player: Player
    } | null
}

export async function setGame(creator: string): Promise<SetGameResp> {
    try {
        const resp = await fetch(setGameUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creatorName: creator,
            }),
            mode: 'cors',
        })

        const { gameId, player } = await resp.json()

        return {
            data: {
                gameId,
                player,
            }
        }

    } catch(e) {
        console.log(e)

        return { data: null }
    }
}