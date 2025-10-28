import express from "express"
import ProductsManager from './src/class/ProductManager.js'
import CartsManager from './src/class/CartManager.js'
import { PORT } from "./src/const/const.js"


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
    console.log("Actualizar producto")
    try {
        const nuevosDatos = req.body
        if (!nuevosDatos || Object.keys(nuevosDatos).length === 0) {
            return res.status(400).json({  mensaje: "PUT", error: "No se recibió ningún producto" })
        }

        const producto = await productManager.actualizarProducto(req.params.pid, nuevosDatos)

        if (!producto){
            return res.status(404).json({ mensaje: "PUT", error: "Producto no encontrado" })
        }

        res.status(200).json({
            mensaje: "PUT",
            status: "Producto actualizado correctamente",
            producto: producto
        })
    } catch (error) {
        res.status(500).json({ mensaje: "PUT", error: "Error al actualizar el producto" })
    }
})

app.delete("/products/:pid", async(req, res) => {
    try {
        const producto = await productManager.eliminarProducto(req.params.pid)
        if (!producto){
            return res.status(404).json({ mensaje: "DELETE", error: "Producto no encontrado" })
        }

        res.status(200).json({
            mensaje: "DELETE",
            status: "Producto eliminado correctamente",
            producto: producto
        })

    } catch (error) {
        res.status(500).json({ mensaje: "DELETE", error: "Error al eliminar el producto" })
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
            carrito: estadoCarrito
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
            carrito: productosCompletos
        })
    } catch (error) {
        console.log("Error buscando el carrito")
        res.status(500).json({ mensaje: "GET", error: `Error al buscar el carrito` })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor ON, corriendo en el puerto ${PORT}`)
})