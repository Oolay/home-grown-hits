import { api } from './api'
import { GameMetaData } from './getGames'
import { Player } from './setGame'

const joinGameUrl = `${api}/hits-games`

type JoinStatus = 'gameStarted' | 'alreadyInGame' | 'joinedGame'

interface JoinGameResp {
    data: {
        status: JoinStatus
        player: Player
        updatedGameMetaData: GameMetaData,
    } | null
}

export async function joinGame(playerDetails: Player, gameData: GameMetaData): Promise<JoinGameResp> {
    console.log('playerDetails', playerDetails)
    try {
        const resp = await fetch(joinGameUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playerDetails,
                gameMetaData: gameData,
            }),
            mode: 'cors',
        })
        
        const { status, player, gameMetaData } = await resp.json()

        return {
            data: {
                status,
                player,
                updatedGameMetaData: gameMetaData,
            }
        }

    } catch(e) {
        console.log(e)

        return { data: null }
    }
}