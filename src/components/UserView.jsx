import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchUsers } from '../reducers/usersSlice'

const UserView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const user = users.find(u => u.id === id)

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users])

  if (!user) {
    return null
  }

  return (
    <div>
      <h3>{user.name}</h3>
      <h4>added blogs</h4>
      <ul>
        {user.blogs?.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView

