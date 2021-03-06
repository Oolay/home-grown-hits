import { api } from './api'
import { GameMetaData } from './getGames'
import { Player } from './setGame'

const leaveGameUrl = `${api}/leave-game`


interface JoinGameResp {
    data: {
        player: Player
        updatedGameMetaData: GameMetaData,
    } | null
}

export async function leaveGame(playerDetails: Player, gameData: GameMetaData): Promise<JoinGameResp> {
    console.log('playerDetails', playerDetails)
    try {
        const resp = await fetch(leaveGameUrl, {
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

        const { player, gameMetaData } = await resp.json()

        return {
            data: {
                player,
                updatedGameMetaData: gameMetaData,
            }
        }

    } catch(e) {
        console.log(e)

        return { data: null }
    }
}