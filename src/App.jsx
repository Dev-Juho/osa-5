import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import UsersView from './components/UsersView'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'
import blogService from './services/blogs'
import usersService from './services/users'
import { addBlog, initializeBlogs } from './reducers/blogsSlice'
import { loginUser, logoutUser, setUser } from './reducers/userSlice'
import { showNotification } from './reducers/notificationSlice'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    if (user?.token) {
      blogService.setToken(user.token)
    }
  }, [user])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      await dispatch(loginUser({ username, password }))
      setUsername('')
      setPassword('')
    } catch {
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const handleRegister = async event => {
    event.preventDefault()
    try {
      await usersService.create({
        name: newName,
        username: newUsername,
        password: 'sekret',
      })
      setNewName('')
      setNewUsername('')
      dispatch(showNotification(`created user ${newUsername}`))
    } catch (error) {
      const message = error.response?.data?.error || 'failed to create user'
      dispatch(showNotification(message))
    }
  }

  const createBlog = async newBlog => {
    try {
      await dispatch(addBlog(newBlog))
      setShowForm(false)
    } catch {
      dispatch(showNotification('failed to create blog'))
    }
  }

  const handleDemoLogin = () => {
    const demoUser = { name: 'Demo User', username: 'demo', token: null }
    dispatch(setUser(demoUser))
    blogService.setToken(null)
    dispatch(showNotification('signed in as demo user'))
  }

  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  const blogsView = (
    <div className="blogs-section">
      <div style={{ marginBottom: '1rem' }}>
        {!showForm && (
          <button className="ghost-button" onClick={() => setShowForm(true)}>
            new blog
          </button>
        )}
        {showForm && (
          <div>
            <BlogForm createBlog={createBlog} />
          </div>
        )}
      </div>

      <div className="blogs-list">
        {sortedBlogs.map(blog => (
          <div className="blog-item" key={blog.id}>
            <Blog blog={blog} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="app-shell">
      <div className="app-card">
        <h2 className="app-title">blog app</h2>
        {notification && <div className="notification">{notification}</div>}

        {!user && (
          <div className="login-card">
            <h3>log in to application</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">username</label>
                  <input
                    id="username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                  />
                </div>
                <button type="submit">login</button>
              </form>

              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Need an account?</h4>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input id="name" value={newName} onChange={({ target }) => setNewName(target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-username">username</label>
                    <input
                      id="new-username"
                      value={newUsername}
                      onChange={({ target }) => setNewUsername(target.value)}
                    />
                  </div>
                  <button type="submit">create account (pwd: sekret)</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <p style={{ margin: '0.5rem 0' }}>or</p>
                  <button type="button" className="ghost-button" onClick={handleDemoLogin}>
                    continue as demo user
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {user && (
          <div>
            <Navigation user={user} onLogout={handleLogout} />

            <Routes>
              <Route path="/" element={blogsView} />
              <Route path="/blogs/:id" element={<BlogView />} />
              <Route path="/users" element={<UsersView />} />
              <Route path="/users/:id" element={<UserView />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
