import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Signup() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    username: '', 
    password: '' 
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData)
      navigate('/')
    } catch (err) {
      setError('Registration failed. Username or email might be taken.')
    }
  }

  return (
    <>
      <Navbar />
      
      <div className="sign-forms">
        <h1>Sign Up</h1>
        {error && <p style={{color:'red'}}>{error}</p>}
        <form onSubmit={handleSubmit} className="form-inner">
          <label>Name</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <label>Email</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <label>Username</label>
          <input 
            type="text" 
            required
            pattern="^[a-zA-Z0-9_-]{1,20}$"
            title="1-20 characters, letters, numbers, - or _"
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
          />
          <label>Password</label>
          <input 
            type="password" 
            required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="form-btn">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login" className="sign-link">Log in</Link></p>
        <Link to="/" className="sign-link">Back to Home</Link>
      </div>
    </>
  )
}