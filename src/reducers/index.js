import { combineReducers } from 'redux'
import doodleReducer from './doodle'
import accountReducer from './account'
import imagesReducer from './images'
import publicImagesReducer from './publicimages'
import sliderReducer from './slider'

const appReducer = combineReducers({
  doodle: doodleReducer,
  account: accountReducer,
  images: imagesReducer,
  publicImages: publicImagesReducer,
  slider: sliderReducer
})

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
