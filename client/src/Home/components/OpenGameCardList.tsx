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
    games: GameMetaData[]
}

const OpenGameCardList: React.FC<Props> = ({ games }) => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            {
                games
                    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
                    .map(({ creator, players }) => (
                        <OpenGameCard
                            creator={creator}
                            players={players}
                        />
                    ))
            }
        </div>
    )
}

export default OpenGameCardList