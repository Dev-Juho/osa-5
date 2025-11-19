import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  return (
    <div>
      <Link className="blog-link" to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

export default Blog
