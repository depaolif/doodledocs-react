import { setImageList } from './image'
import axios from 'axios'

export const setToken = (token) => ({
 type: 'SET_TOKEN', payload: token
})

export const setUsername = (username) => ({
  type: 'SET_USERNAME', payload: username
})

export const setId = (id) => ({
  type: 'SET_ID', payload: id
})

export const logOut = () => ({
  type: 'USER_LOGOUT'
})

export const getInfo = (token) => {
	return (dispatch) => {
		axios({
			method: 'GET',
		   	url: 'http://localhost:3001/v1/me',
			headers: {bearer: token}
		})
		.then(resp => {
			dispatch(setUsername(resp.data.username))
	   		dispatch(setImageList(resp.data.images))
		})
  	}
}