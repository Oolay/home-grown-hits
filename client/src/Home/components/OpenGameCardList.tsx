import React from 'react'
import { makeStyles } from '@material-ui/styles'

import { GameMetaData } from '../../services/getGames'
import OpenGameCard from './OpenGameCard'

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        '& > *': {
            marginBottom: '1rem',
        },
    }
})

interface Props {
    playerName: string
    games: GameMetaData[]
    handleJoinGame: (gameDate: GameMetaData) => () => void
}

const OpenGameCardList: React.FC<Props> = ({ playerName, games, handleJoinGame }) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            {
                games
                    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
                    .map(gameMetaData => (
                        <OpenGameCard
                            playerName={playerName}
                            gameMetaData={gameMetaData}
                            handleJoinGame={handleJoinGame(gameMetaData)}
                        />
                    ))
            }
        </div>
    )
}

export default OpenGameCardList