import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    id: '123',
    title: 'The Test Blog',
    author: 'Test Author',
  }

  const renderWithRouter = component => render(<MemoryRouter>{component}</MemoryRouter>)

  test('renders title and author as link', () => {
    renderWithRouter(<Blog blog={blog} />)
    const link = screen.getByRole('link', { name: /The Test Blog Test Author/ })
    expect(link).toBeInTheDocument()
  })

  test('link points to blog detail route', () => {
    renderWithRouter(<Blog blog={blog} />)
    const link = screen.getByRole('link', { name: /The Test Blog Test Author/ })
    expect(link).toHaveAttribute('href', '/blogs/123')
  })
})
