import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.username, formData.password)
      navigate('/') 
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <>
      <Navbar />
      <div className="sign-forms">
        <h1>Log In</h1>
        {error && <p style={{color:'red'}}>{error}</p>}
        <form onSubmit={handleSubmit} className="form-inner">
          <label>Username</label>
          <input 
            type="text" 
            required
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
          <button type="submit" className="form-btn">Log In</button>
        </form>
        <p>Don't have an account? <Link to="/signup" className="sign-link">Sign up</Link></p>
        <Link to="/" className="sign-link">Back to Home</Link>
      </div>
    </>
  )
}