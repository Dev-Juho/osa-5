import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    title: 'The Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 7,
  }

  test('renders title and author by default, not url/likes', () => {
    render(<Blog blog={blog} />)
    expect(screen.getByText(/The Test Blog/)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/)).toBeInTheDocument()
    expect(screen.queryByText(/http:\/\/example.com/)).not.toBeInTheDocument()
    expect(screen.queryByText(/likes\s*7/)).not.toBeInTheDocument()
  })

  test('shows url, likes and user after clicking view', () => {
    const withUser = { ...blog, user: { name: 'Matti Luukkainen' } }
    render(<Blog blog={withUser} />)
    fireEvent.click(screen.getByText('view'))
    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText(/likes\s*7/)).toBeInTheDocument()
    expect(screen.getByText('Matti Luukkainen')).toBeInTheDocument()
  })

  test('calls onLike twice when like button clicked twice', () => {
    const onLike = vi.fn()
    render(<Blog blog={blog} onLike={onLike} />)
    fireEvent.click(screen.getByText('view'))
    const likeBtn = screen.getByText('like')
    fireEvent.click(likeBtn)
    fireEvent.click(likeBtn)
    expect(onLike).toHaveBeenCalledTimes(2)
  })
})


