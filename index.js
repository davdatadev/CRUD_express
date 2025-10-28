import express from "express"
import fs from "fs/promises"

//Constantes
const PORT = 5000
const PRODUCTS_PATH = "src/db/products.json"

//Clases
class ProductsManager {
    constructor(){
        this.products = []
    }

    async leerProductos() {
        try {
            const data = await fs.readFile(PRODUCTS_PATH, { encoding : "utf-8" })
            this.products = JSON.parse(data)
            return this.products
        }catch(error){
            console.log(`Hubo un error leyendo el json: ${error}`)
        }
    }

    async leerUnProducto(productId) {
        try {
            const data = await fs.readFile(PRODUCTS_PATH, { encoding : "utf-8" })
            const productos = JSON.parse(data)
            const productoEncontrado = productos.find(prod => prod.id == productId)

            if (!productoEncontrado) {
                return null
            }

            return productoEncontrado
        } catch (error) {
            console.error("Error leyendo un producto:", error)
        }
    }

    async crearProducto(nuevoProducto) {
        try{
            // Leer Productos
            const productos = await this.leerProductos()
            
            // Validar campos no strings
            if (nuevoProducto.price && typeof nuevoProducto.price !== "number") {
                console.log("El campo 'price' debe ser un número")
            }
            if (nuevoProducto.status && typeof nuevoProducto.status !== "boolean") {
                console.log("El campo 'status' debe ser un valor booleano (true/false)")
            }
            if (nuevoProducto.stock && typeof nuevoProducto.stock !== "number") {
                console.log("El campo 'stock' debe ser un número")
            }

            let nuevoId
            do {
                nuevoId = Date.now().toString()
            } while (productos.some(producto => producto.id === nuevoId))
            
            nuevoProducto.id = nuevoId
            
            // Organizar id de primero
            const productoAgregar = {
                id:nuevoProducto.id,
                ...nuevoProducto
            }
            
            productos.push(productoAgregar)

            await fs.writeFile(PRODUCTS_PATH, JSON.stringify(productos, null, 2))
            return nuevoProducto

        }catch(error){
            console.error("Hubo un error", error)
        }
    }
}

const productManager = new ProductsManager()

// Crear servidor
const app = express()
app.use(express.json())

// Endpoints
app.get("/", (req, res) => {
    res.send("Bienvenido!")
})

app.get("/products", async (req, res) => {
    console.log("Listar productos")
    try{
        const productos = await productManager.leerProductos()
        res.json({
            mensaje: "GET",
            products: productos
        })
    }catch(error){
        console.log("Error")
        res.status(500).json({ mensaje: "GET", error: "Error al listar los productos" })
    }
})

app.get("/products/:pid", async (req, res) => {
    console.log("Buscar producto")
    try {
        const { pid } = req.params
        const producto = await productManager.leerUnProducto(pid)
        res.status(201).json({
            mensaje: "GET",
            product: producto
        })
    } catch (error) {
        console.log("Error buscando el producto")
        res.status(500).json({ mensaje: "GET", error: `Error al buscar el producto` })
    }
})

app.post("/products", async (req, res) => {
    console.log("Crear producto")
    try{
        const nuevoProducto = req.body
        if (!nuevoProducto) {
            return res.status(400).json({  mensaje: "GET", error: "No se recibió ningún producto" })
        }
        const estadoProducto = await productManager.crearProducto(nuevoProducto)
        res.status(201).json({
            mensaje: "POST",
            status: "Producto Creado correctamente",
            producto: estadoProducto
        })
    }catch(error){
        console.log("Error", error)
        res.status(500).json({ mensaje: "POST", error: "Error al crear el producto" })
    }
})

app.post("/carts", async (req, res) => {
    console.log("Crear pedido en carro")
    try {
        
    } catch (error) {
        
    }
})

app.listen(PORT, () => {
    console.log(`Servidor ON, corriendo en el puerto ${PORT}`)
})