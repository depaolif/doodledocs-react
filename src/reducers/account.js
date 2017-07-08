export default function accountsReducer(state = {}, action) {
  switch (action.type) {
    case "SET_TOKEN":
      return Object.assign({}, state, {token: action.payload})
    case "SET_USERNAME":
   	  return Object.assign({}, state, {username: action.payload})
   	case "SET_ID":
  	  return Object.assign({}, state, {id: action.payload})
    default:
      return state
  }
}
