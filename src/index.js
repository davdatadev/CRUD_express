import express from "express"
import handlebars from "express-handlebars"
import http from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import rootRouter from "./routes/root.routes.js"
import productsRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/carts.routes.js"
import { PORT, DB_URL } from "./const/constantes.js"
import { setSocketIO } from "./class/ProductsManager.js"


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const __publicdir = join(__dirname, 'public')

// Express se encarga de la capa de aplicación
const app = express()
// Servidor HTTP nativo de Node.js responde solicitudes que vengan de http://localhost:5000
const httpserver = http.createServer(app)
// WebSocket se encarga de la capa de transporte (comunicación en tiempo real) ws://localhost:5000
export const servidorWS = new Server(httpserver)

// Eventos de WebSocket
servidorWS.on("connection", (socket) => {
    console.log("Nuevo cliente conectado", socket.id)
    socket.emit("mensajeDesdeServidor", "Hola cliente, te saludo desde el servidor")
    socket.on("mensajeDesdeCliente", (data) => {
        console.log("Mensaje recibido del cliente:", data)
    })
})

setSocketIO(servidorWS) // Configurar la instancia de Socket.IO en ProductsManager

// Configuración más personalizable de Handlebars
const hbs = handlebars.create({
    extname: '.handlebars', // La extensión de tus archivos de plantilla
    layoutsDir: join(__dirname, 'views', 'layouts'), // Ruta de layouts
    partialsDir: join(__dirname, 'views', 'partials'), // Ruta de partials
    defaultLayout: 'main',
    helpers: {
        eq: function (a, b) { return a === b; } // Helper para comparar
    }
});

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', join(__dirname, 'views'))

// Middlewares
app.use(express.json())
app.use(express.static(__publicdir))

app.use("/", rootRouter)
app.use("/products", productsRouter)
app.use("/carts", cartsRouter)

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ mensaje: "Error interno del servidor" })
})

// Conexión a la base de datos MongoDB
mongoose.connect(DB_URL)
    .then(() => {
        console.log("Conectado a la base de datos MongoDB")
        // Iniciar servidor
        httpserver.listen(PORT, () => {
            console.log(`Servidor ON, corriendo en el puerto ${PORT}`)
        })
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos MongoDB:", error)
    })

