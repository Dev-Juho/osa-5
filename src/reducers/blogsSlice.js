import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationSlice'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(_state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updated = action.payload
      const index = state.findIndex(blog => blog.id === updated.id)
      if (index !== -1) {
        state[index] = updated
      }
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogsSlice.actions

export const initializeBlogs = () => async dispatch => {
  const blogs = await blogService.getAll()
  dispatch(setBlogs(blogs))
}

export const addBlog = newBlog => async dispatch => {
  const created = await blogService.create(newBlog)
  dispatch(appendBlog(created))
  dispatch(showNotification(`added blog ${created.title}`))
  return created
}

export const likeExistingBlog = blog => async dispatch => {
  const updated = await blogService.updateLikes(blog.id, (blog.likes || 0) + 1)
  dispatch(updateBlog(updated))
}

export const deleteBlog = blog => async dispatch => {
  await blogService.remove(blog.id)
  dispatch(removeBlog(blog.id))
  dispatch(showNotification(`removed blog ${blog.title}`))
}

export const addCommentToBlog = (blogId, comment) => async dispatch => {
  const updated = await blogService.addComment(blogId, comment)
  dispatch(updateBlog(updated))
}

export default blogsSlice.reducer

