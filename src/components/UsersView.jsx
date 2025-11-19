import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../reducers/usersSlice'

const UsersView = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users])

  return (
    <div className="users-section">
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView

