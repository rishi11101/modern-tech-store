import { getDBConnection } from './db/db.js'
import { products } from './data.js'

async function seedTable() {
  const db = await getDBConnection()

  // 1. Create Users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, email TEXT, username TEXT, password TEXT
    )
  `)

  // 2. Create Products (ADDED STOCK BACK)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT, brand TEXT, category TEXT, price REAL, image TEXT, stock INTEGER
    )
  `)

  // 3. Create Cart
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER, product_id INTEGER, quantity INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `)
  
  try {
    await db.exec('BEGIN TRANSACTION')

    for (const { title, brand, price, image, category } of products) {
      await db.run(`
        INSERT INTO products (title, brand, price, image, category, stock)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [title, brand, price, `/images/${image}`, category, 50] // Added 50 stock by default
      )
    }

    await db.exec('COMMIT')
    console.log('Database reset & seeded successfully.')

  } catch (err) {
    await db.exec('ROLLBACK')
    console.error('Error:', err.message)
  } finally {
    await db.close()
  }
}

seedTable()