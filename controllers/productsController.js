import { getDBConnection } from '../db/db.js'

export async function getCategories(req, res) {
  try {
    const db = await getDBConnection()
    const rows = await db.all('SELECT DISTINCT category FROM products')
    const categories = rows.map(row => row.category)
    res.json(categories)
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch categories'})
  }
}

export async function getProducts(req, res) {
  try {
    const db = await getDBConnection()
    let query = 'SELECT * FROM products'
    let params = []
    
    const { category, search } = req.query

    if (category) {
      query += ' WHERE category = ?'
      params.push(category)
    } else if (search) {
      query += ' WHERE title LIKE ? OR brand LIKE ? OR category LIKE ?'
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
    }
    
    const products = await db.all(query, params)
    res.json(products)
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch products'})
  }
}