import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'	

function configureStore(){
  return createStore(rootReducer, compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f))
}

const store = configureStore()
const token = localStorage.getItem('token')
store.dispatch({type: "SET_TOKEN", payload: token})
const id = localStorage.getItem('id')
store.dispatch({type: "SET_ID", payload: parseInt(id, 10)})
export default store
