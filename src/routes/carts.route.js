import express from "express"
import CartsManager from '../class/CartsManager.js'

const router = express.Router()
const cartManager = new CartsManager()

router.post("/", async (req, res) => {
    console.log("Agregar pedido en carro")
    try {
        const estadoCarrito = await cartManager.crearCarrito()
        res.status(201).json({
            mensaje: "POST",
            status: "Carrito creado correctamente",
            carrito: estadoCarrito
        })
    } catch (error) {
        
    }
})

router.get("/:cid", async (req, res) => {
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

// Agregar producto a carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid

    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ mensaje: "POST", error: "Error al agregar producto a carrito" })
    }
}
)

export default router