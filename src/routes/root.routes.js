import express from "express"
import { rootHandler, productsViewHandler } from "../controllers/root.controller.js"

const router = express.Router()

router.get("/", rootHandler)

router.get("/products", productsViewHandler)

export default router