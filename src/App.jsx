import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3003/api/login', { username, password })
      setUser({ name: res.data.name, username: res.data.username })
      blogService.setToken(res.data.token)
      setUsername('')
      setPassword('')
      setError(null)
    } catch (err) {
      setError('wrong username or password')
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
  }

  const createBlog = async (newBlog) => {
    const created = await blogService.create(newBlog)
    setBlogs(blogs.concat(created))
    setShowForm(false)
  }

  const likeBlog = async (blog) => {
    const updated = await blogService.updateLikes(blog.id, (blog.likes || 0) + 1)
    setBlogs(blogs.map(b => b.id === blog.id ? updated : b))
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => (b.likes || 0) - (a.likes || 0))

  return (
    <div>
      <h2>blogs</h2>
      {error && <div>{error}</div>}
      {!user && (
        <div>
          <h3>log in to application</h3>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="username">username</label>
              <input id="username" value={username} onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>
              <label htmlFor="password">password</label>
              <input id="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      )}

      {user && (
        <div>
          <div>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </div>

          <div>
            {!showForm && <button onClick={() => setShowForm(true)}>new blog</button>}
            {showForm && (
              <div>
                <BlogForm createBlog={createBlog} />
              </div>
            )}
          </div>

          <div>
            {sortedBlogs.map(blog => (
              <div className="blog" key={blog.id}>
                <Blog
                  blog={blog}
                  onLike={likeBlog}
                  onRemove={(blog.user === user.username || blog.user?.username === user.username) ? deleteBlog : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App