import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import blogService from '../services/blogs'
import { showNotification } from './notificationSlice'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const loginUser = credentials => async dispatch => {
  try {
    const response = await axios.post('http://localhost:3003/api/login', credentials)
    const userData = {
      name: response.data.name,
      username: response.data.username,
      token: response.data.token,
    }
    blogService.setToken(userData.token)
    dispatch(setUser(userData))
    dispatch(showNotification(`welcome ${userData.name}`))
    return userData
  } catch (error) {
    dispatch(showNotification('wrong username or password'))
    throw error
  }
}

export const logoutUser = () => dispatch => {
  blogService.setToken(null)
  dispatch(clearUser())
}

export default userSlice.reducer

