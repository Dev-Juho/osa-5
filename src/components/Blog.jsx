import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExpanded(v => !v)}>{expanded ? 'hide' : 'view'}</button>
      </div>
      {expanded && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes || 0} <button onClick={() => onLike && onLike(blog)}>like</button>
          </div>
          {blog.user?.name && <div>{blog.user.name}</div>}
          {onRemove && (
            <button onClick={() => onRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog