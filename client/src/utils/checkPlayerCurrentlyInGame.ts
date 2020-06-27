import { getGames, GameMetaData } from '../services/getGames'

export default async function checkPlayerCurrentlyInGame() {
    const currentGame = localStorage.getItem('currentGame')
    const allGames = await getGames()

    return allGames.some(game => game.gameId === currentGame)
}
