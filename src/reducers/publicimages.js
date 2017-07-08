export default function publicImagesReducer(state = {list: [], current: {}}, action) {
  switch (action.type) {
    case "SET_PUBLIC_IMAGE_LIST":
      return Object.assign({}, state, {list: action.payload})
    case "SET_CURRENT_PUBLIC_IMAGE":
      return Object.assign({}, state, {current: action.payload})
    default:
      return state
  }
}
