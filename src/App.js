import './App.css';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, browserHistory, Switch } from 'react-router-dom'
import ConnectedLogin from './components/Login'
import ConnectedLogout from './components/Logout'
import ConnectedRegister from './components/Register'
import ConnectedDoodle from './components/Doodle'
import ConnectedProfile from './components/Profile'
import ConnectedNavBar from './components/NavBar'
import ConnectedImages from './components/Images'
import PrivateRoute from './components/PrivateRoute'
import PrivateAuthRoute from './components/PrivateAuth'
import { getInfo } from './actions/account'

class App extends Component {
  componentWillMount() {
    if (this.props.account.token) {
      this.props.getInfo(this.props.account.token)
    }
  }

  render() {
    return (
        <div className="App">
          <Router history={browserHistory}>
            <div>
              <Route path="/" component={ConnectedNavBar}/>
              <Switch>
                <Route exact path="/" component={ConnectedDoodle} />
                <PrivateAuthRoute path="/login" component={ConnectedLogin} />
                <PrivateRoute path="/logout" component={ConnectedLogout} />
                <PrivateAuthRoute path="/register" component={ConnectedRegister} />
                <Route exact path="/images" component={ConnectedImages}/>
                <Route path="/images/:imageId" component={ConnectedDoodle}/>
                <PrivateRoute path="/profile" component={ConnectedProfile} />
              </Switch>
            </div>
          </Router>
        </div>
      );
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  getInfo: (token) => {
    dispatch(getInfo(token))
  }
})

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
