import express from 'express'
import { getCategories, getProducts } from '../controllers/productsController.js'

export const productsRouter = express.Router()

productsRouter.get('/categories', getCategories) 
productsRouter.get('/', getProducts)