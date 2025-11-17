import express from "express"
import { PORT } from "./const/constantes.js"
import rootRouter from "./routes/root.route.js"
import productsRouter from "./routes/products.route.js"
import cartsRouter from "./routes/carts.route.js"

// Crear servidor
const app = express()

// Middlewares
app.use(express.json())

app.use("/", rootRouter)

app.use("/products", productsRouter)

app.use("/carts", cartsRouter)

// Iniciar servidor

app.listen(PORT, () => {
    console.log(`Servidor ON, corriendo en el puerto ${PORT}`)
})