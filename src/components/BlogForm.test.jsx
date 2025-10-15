import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('calls createBlog with correct data on submit', () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)

  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } })
  fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'New Author' } })
  fireEvent.change(screen.getByLabelText(/url/i), { target: { value: 'http://new.url' } })

  fireEvent.click(screen.getByText(/create/i))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'New Title',
    author: 'New Author',
    url: 'http://new.url'
  })
})


