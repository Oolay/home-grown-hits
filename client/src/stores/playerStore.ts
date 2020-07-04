import { Player } from '../services/setGame'
import { GameMetaData } from '../services/getGames'


class PlayerStore {
    public player: Player | null = null

    public joinedGames: GameMetaData[] = []

    public setJoinedGames = (games: GameMetaData[]) => {
        this.joinedGames = [...games]
    }
}

const playerStoreInstance = new PlayerStore

export default playerStoreInstance
