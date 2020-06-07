import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'

import Home from './Home'
import Game from './Game'

const hitsTheme = createMuiTheme({
  palette: {
    type: 'dark',
  }
})

const App: React.FC = () => (
  <ThemeProvider theme={hitsTheme}>
    <CssBaseline />
    <Router>
      <Switch>
        <Route path='/:gameId'>
          <Game />
        </Route>
        <Route path='/' exact>
          <Typography>
            <Home />
          </Typography>
        </Route>
      </Switch>
    </Router>
  </ThemeProvider>
)

export default App
