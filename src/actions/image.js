export const setImageList = (list) => ({
  type: 'SET_IMAGE_LIST', payload: list
})

export const addImage = (image) => ({
  type: 'ADD_IMAGE', payload: image
})

export const setCurrentImage = (image) => ({
  type: 'SET_CURRENT_IMAGE', payload: image
})

export const updatePreviewForImage = (image) => ({
  type: 'UPDATE_PREVIEW_FOR_IMAGE', payload: image
})

export const removeImage = (image) => ({
  type: 'REMOVE_IMAGE', payload: image
})

export const resetImage = () => ({
  type: 'RESET_IMAGE'
})

export const setAutoSave = (bool) => ({
	type: 'SET_AUTO_SAVE', payload: bool
})