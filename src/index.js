import express from "express"
import { PORT } from "./const/constantes.js"
import rootRouter from "./routes/root.routes.js"
import productsRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/carts.routes.js"
import handlebars from "express-handlebars"

import { fileURLToPath } from 'url'
import { dirname, join } from 'path' 


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Crear servidor
const app = express()

// Configurar Handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", join(__dirname, "views"))

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