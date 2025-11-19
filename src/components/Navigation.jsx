import { NavLink } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => {
  return (
    <nav className="nav-shell">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        blogs
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        users
      </NavLink>
      {user && (
        <span className="nav-user">
          {user.name} logged in <button className="ghost-button" onClick={onLogout}>logout</button>
        </span>
      )}
    </nav>
  )
}

export default Navigation

