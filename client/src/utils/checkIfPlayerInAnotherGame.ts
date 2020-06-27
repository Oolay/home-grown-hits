import { getGames } from '../services/getGames'

export default async function checkIfPlayerInAnotherGame(currentGameId: string) {
    const playerId = localStorage.getItem('playerId')
    const allGames = await getGames()

    return allGames.some(game => (
        game.gameId !== currentGameId
        && game.players.some(player => player.id === playerId)
    ))
}
