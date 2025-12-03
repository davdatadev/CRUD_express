import express from "express"
import ProductsManager from '../class/ProductsManager.js'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"

const router = express.Router()

const productManager = new ProductsManager()

router.get("/", getAllProducts)

router.get("/:pid", getProductById)

router.post("/",validarProducto, createProduct)

router.put("/:pid", updateProduct)

router.delete("/:pid", deleteProduct)

function validarProducto(req, res, next) {
    console.log("Validando producto")
    next()
}

export default router