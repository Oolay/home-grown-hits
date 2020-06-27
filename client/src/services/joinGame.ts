import { api } from './api'
import { GameMetaData } from './getGames'
import { Player } from './setGame'

const joinGameUrl = `${api}/hits-games`


interface JoinGameResp {
    data: {
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
        
        const { player, gameMetaData: { Attributes } } = await resp.json()

        return {
            data: {
                player,
                updatedGameMetaData: Attributes,
            }
        }

    } catch(e) {
        console.log(e)

        return { data: null }
    }
}