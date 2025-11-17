import express from "express"
import { PORT } from "./const/constantes.js"
import rootRouter from "./routes/root.routes.js"
import productsRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/carts.routes.js"

// Crear servidor
const app = express()

// Middlewares
app.use(express.json())

app.use("/", rootRouter)

app.use("/products", productsRouter)

app.use("/carts", cartsRouter)

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ mensaje: "Error interno del servidor" })
})

// Iniciar servidor

app.listen(PORT, () => {
    console.log(`Servidor ON, corriendo en el puerto ${PORT}`)
})