import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar({ onSearch }) {
  const { user, logout } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="top-banner">
        <p className="top-banner-greeting">
          {user ? `Welcome, ${user.name}!` : 'Welcome, Guest!'}
        </p>

        <input 
          type="text" 
          placeholder="Search products..." 
          className="search-input"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />

        <Link to="/cart" className="cart-banner-link">
             <img src="/images/cart.png" alt="Cart"/> 
             <span>Cart</span>
        </Link>
        
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/menu.png" alt="Menu" />
        </button>

        <nav className={`header-menu ${menuOpen ? 'open' : ''}`}>
          {!user ? (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          ) : (
            <button className="main-btn" onClick={logout}>Log out</button>
          )}
        </nav>
      </div>

      <header>
        <Link to="/"><img src="/images/mainLogo.png" alt="Everyday Tech" /></Link>
        <div className="header-text">
          <h1>Modern Tech Store</h1>
          <p className="subhead">Smart tech essentials for work, play & everyday life</p>
        </div>
      </header>
    </>
  )
}