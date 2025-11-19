import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  deleteBlog as deleteBlogThunk,
  initializeBlogs,
  likeExistingBlog,
  addCommentToBlog,
} from '../reducers/blogsSlice'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const blog = blogs.find(b => b.id === id)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!blogs || blogs.length === 0) {
      dispatch(initializeBlogs())
    }
  }, [dispatch, blogs?.length])

  if (!blog) {
    return null
  }

  const handleLike = () => {
    dispatch(likeExistingBlog(blog))
  }

  const handleRemove = () => {
    if (
      window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    ) {
      dispatch(deleteBlogThunk(blog))
      navigate('/')
    }
  }

  const handleAddComment = event => {
    event.preventDefault()
    if (comment.trim().length === 0) {
      return
    }
    dispatch(addCommentToBlog(blog.id, comment.trim()))
    setComment('')
  }

  const canRemove =
    user && (blog.user === user.username || blog.user?.username === user.username)

  return (
    <div className="blogs-section">
      <h2 className="app-title" style={{ fontSize: '1.5rem' }}>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes || 0} likes <button onClick={handleLike}>like</button>
      </div>
      {blog.user?.name && <div>added by {blog.user.name}</div>}
      {canRemove && (
        <button className="ghost-button" onClick={handleRemove}>
          remove
        </button>
      )}
      <div className="comments-section" style={{ marginTop: '1.5rem' }}>
        <h3>comments</h3>
        <form onSubmit={handleAddComment} style={{ marginBottom: '1rem' }}>
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="write a comment"
          />
          <button type="submit">add comment</button>
        </form>
        {blog.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={`${blog.id}-comment-${index}`}>{comment}</li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  )
}

export default BlogView

