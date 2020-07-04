import { getGames } from '../services/getGames'

export default async function getOtherJoinedGames(currentGameId: string) {
    const playerId = localStorage.getItem('playerId')
    const allGames = await getGames()

    return allGames.filter(game => (
        game.gameId !== currentGameId
        && game.players.some(player => player.id === playerId)
    ))
}
