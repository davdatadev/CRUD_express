import express from "express"
import fs from "fs/promises"

//Constantes
const PORT = 5000
const PRODUCTS_PATH = "src/db/products.json"
const CARTS_PATH = "src/db/carts.json"

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
            const data = await this.leerProductos()
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
            return productoAgregar

        }catch(error){
            console.error("Hubo un error", error)
        }
    }

    async actualizarProducto(productId, camposActualizados){
        try {
            const productos = await this.leerProductos()
            const productIndex = productos.findIndex(prod => prod.id == productId)

            if (productIndex === -1) {
                return null
            }

            delete camposActualizados.id

            const productoActualizado = {
                ...productos[index],
                ...camposActualizados
            }

            productos[index] = productoActualizado
            await fs.writeFile(PRODUCTS_PATH, JSON.stringify(productos, null, 2))

            return productoActualizado
        } catch (error) {
            
        }
    }
}

class CartsManager {
    constructor(){
        this.carts = []
    }

    async leerCarritos() {
        try {
            const data = await fs.readFile(CARTS_PATH, { encoding : "utf-8" })
            this.carts = JSON.parse(data)
            return this.carts
        }catch(error){
            console.log(`Hubo un error leyendo el json: ${error}`)
        }
    }

    async agregarCarrito(nuevoCarrito){
        try {
            // Leer carritos
            const carritos = await this.leerCarritos()
            
            let nuevoId

            do {
                nuevoId = Date.now().toString()
            } while (carritos.some(cart => cart.id === nuevoId))
            
            nuevoCarrito.id = nuevoId

            const carritoAgregar = {
                id:nuevoCarrito.id,
                ...nuevoCarrito
            }
            
            carritos.push(carritoAgregar)

            await fs.writeFile(CARTS_PATH, JSON.stringify(carritos, null, 2))
            return carritoAgregar

        } catch (error) {
            
        }

    }

    async listarProductos(cartId){
        try {
            const data = await fs.readFile(CARTS_PATH, { encoding : "utf-8" })
            const carts = JSON.parse(data)
            const carritoEncontrado = carts.find(cart => cart.id == cartId)

            if (!carritoEncontrado) {
                return null
            }
            // asegurando de que siempre retorne array
            return carritoEncontrado.products || []
        } catch (error) {
            console.error("Error leyendo un producto:", error)
        }
    }
}

const productManager = new ProductsManager()
const cartManager = new CartsManager()

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
        if (!producto) {
            return res.status(404).json({
                mensaje: "GET",
                error: `No se encontró ningún producto con el id ${pid}`
            })
        }
        
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
            return res.status(400).json({  mensaje: "POST", error: "No se recibió ningún producto" })
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

app.put("/products/:pid", async(req, res) => {
    try {
        const nuevosDatos = req.body
        if (!nuevosDatos) {
            return res.status(400).json({  mensaje: "PUT", error: "No se recibió ningún producto" })
        }

        const producto = await productManager.actualizarProducto(req.params.pid, nuevosDatos)

        if (!producto){
            return res.status(404).json({ mensaje: "PUT", error: "Producto no encontrado" })
        }

        res.status(200).json({
            mensaje: "PUT",
            status: "Producto actualizado correctamente",
            producto
        })
    } catch (error) {
        res.status(500).json({ mensaje: "PUT", error: "Error al actualizar el producto" })
    }
})

app.post("/carts", async (req, res) => {
    console.log("Agregar pedido en carro")
    try {
        const nuevoCarrito = req.body
        if (!nuevoCarrito) {
            return res.status(400).json({  mensaje: "GET", error: "No se recibió ningún carrito" })
        }
        const estadoCarrito = await cartManager.agregarCarrito(nuevoCarrito)
        res.status(201).json({
            mensaje: "POST",
            status: "Carrito Creado correctamente",
            producto: estadoCarrito
        })
    } catch (error) {
        
    }
})

app.get("/carts/:cid", async (req, res) => {
    console.log("Listar productos de carrito especifico")
    try {
        const { cid } = req.params
        const productosEnCarrito  = await cartManager.listarProductos(cid)
        if (!productosEnCarrito ) {
            return res.status(404).json({
                mensaje: "GET",
                error: `No se encontró ningún carrito con el id ${cid}`
            })
        }

        let productosCompletos = []
        for (const prod of productosEnCarrito) {
            const producto = await productManager.leerUnProducto(prod.product)
            if (producto) {
                const productoAgregar = {
                    ...producto,
                    quantity: prod.quantity
                }
                productosCompletos.push(productoAgregar)
            }
        }

        res.status(200).json({
            mensaje: "GET",
            product: productosCompletos
        })
    } catch (error) {
        console.log("Error buscando el carrito")
        res.status(500).json({ mensaje: "GET", error: `Error al buscar el carrito` })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor ON, corriendo en el puerto ${PORT}`)
})