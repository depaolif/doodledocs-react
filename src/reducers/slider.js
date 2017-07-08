export default function sliderReducer(state = {value: 0}, action) {
  switch (action.type) {
    case "SET_SLIDER_VALUE":
      return Object.assign({}, state, {value: action.payload})
    default:
      return state
  }
}
