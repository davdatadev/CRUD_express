import express from "express"
import { createCart, getCartById, addProductToCart, updateCart, updateProductQuantity, removeProductFromCart, clearCart } from '../controllers/carts.controller.js'

const router = express.Router()

router.post("/", createCart)

router.get("/:cid", getCartById)

router.post("/:cid/product/:pid", addProductToCart )

router.put("/:cid", updateCart )

router.put("/:cid/product/:pid", updateProductQuantity )

router.delete("/:cid/product/:pid", removeProductFromCart )

router.delete("/:cid", clearCart )

export default router