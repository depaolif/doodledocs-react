import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateAuth = ({ token, component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !token ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/profile',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const mapStateToProps = (state) => ({
	token: state.account.token
})

const ConnectedPrivateAuth = connect(mapStateToProps, null)(PrivateAuth)

export default ConnectedPrivateAuth
