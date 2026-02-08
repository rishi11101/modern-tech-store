import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Home() {
  const { api, user } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([]) 
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {

    api.get('/products/categories').then(res => setCategories(res.data))
    fetchProducts()
  }, [selectedCategory, searchTerm])

  const fetchProducts = async () => {
    // earch takes priority or works alongside category
    let url = '/products'
    
    // If searching, ignore category or search within it
    if (searchTerm) {
        url += `?search=${searchTerm}`
    } else if (selectedCategory) {
        url += `?category=${selectedCategory}`
    }

    const res = await api.get(url)
    setProducts(res.data)
  }

  // Helper to clear category when typing search
  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term) setSelectedCategory('') // Clear category so search works
  }

  const addToCart = async (productId) => {
    if (!user) return alert("Please log in to add items.")
    try {
      await api.post('/cart/add', { productId })
      alert("Added to cart!")
    } catch (err) {
      alert("Error adding to cart")
    }
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <section className="genre-select-container">
        <label>View by Category</label>
        <select 
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Show All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </section>

      <main className="products">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <span className="genre-label">{product.category}</span>
            <img src={product.image} alt={product.title} />
            <div className="card-details">
              <h3>{product.title}</h3>
              <p>{product.brand}</p>
              <p className="price">${product.price}</p>
              <button className="main-btn" onClick={() => addToCart(product.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </main>
      <footer><p>© Everyday Tech</p></footer>
    </>
  )
}