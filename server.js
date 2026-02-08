import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { fileURLToPath } from 'url'
import path from 'path'
import 'dotenv/config' // Loads .env variables

import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import { cartRouter } from './routes/cart.js'

const app = express()

const PORT = process.env.PORT || 8000 

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// smart cors for both urls
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL];

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}))

app.use(express.json())

// session - Secure in production, simple locally
app.use(session({
  secret: process.env.SESSION_SECRET || 'simple_dev_secret', // .env secret or fallback
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // True on HTTPS, False on Localhost
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 
  }
}))

app.use('/api/products', productsRouter)

app.use('/api/auth', authRouter)

app.use('/api/auth/me', meRouter)

app.use('/api/cart', cartRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})