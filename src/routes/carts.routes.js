import express from "express"
import CartsManager from '../class/CartsManager.js'
import { createCart, getCartById, addProductToCart } from '../controllers/carts.controller.js'

const router = express.Router()
const cartManager = new CartsManager()

router.post("/", createCart)

router.get("/:cid", getCartById)

router.post("/:cid/product/:pid", addProductToCart )

export default router