import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Cart() {
  const { api, user } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user, navigate])

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCartItems(res.data.items)
    } catch (err) {
      console.error("Failed to fetch cart", err)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`)
      setCartItems(prev => prev.filter(item => item.cartItemId !== itemId))
    } catch (err) {
      alert("Failed to delete item")
    }
  }

  const handleCheckout = async () => {
    try {
      await api.delete('/cart/all') 
      setCartItems([])
      alert("Thank you for your purchase!")
      navigate('/')
    } catch (err) {
      alert("Checkout failed")
    }
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <>
      <Navbar />
      <div className="cart-main">
        <h1>Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty. <Link to="/" className="sign-link">Go shopping</Link></p>
        ) : (
          <>
            <ul>
              {cartItems.map(item => (
                <li key={item.cartItemId}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>${item.price} x {item.quantity}</span>
                  </div>
                  <div>
                    <span>{item.brand}</span>
                    <button onClick={() => deleteItem(item.cartItemId)} style={{color:'red'}}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <h3>Total: ${totalPrice.toFixed(2)}</h3>
              <button className="main-btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}