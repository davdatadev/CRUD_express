import ProductsManager from '../class/ProductsManager.js'
import ProductModel from '../models/products.model.js'
const productManager = new ProductsManager()

export const getAllProducts = async (req, res) => {
    console.log("Listar productos - MongoDB")
    try{
        const productos = await ProductModel.find().lean()
        res.render('products', {
            titulo: "Catálogo de Productos",
            products: productos,
            hasProducts: productos && productos.length > 0
        })
    }catch(error){
        console.log("Error")
        res.status(500).json({ mensaje: "GET", error: `Error al consultar los productos> ${error.message}` })
    }
}

// export const listProducts = async (req, res) => {
//     console.log("Listar productos - HTML")
//     try{
//         const productos = await productManager.leerProductos()
//         res.render('products', {
//             titulo: "Catálogo de Productos",
//             products: productos,
//             hasProducts: productos && productos.length > 0 // Variable auxiliar para el #if
//         })
//     }catch(error){
//         console.log("Error")
//         res.status(500).render('error', { 
//             titulo: "Error", 
//             mensaje: `Error al cargar el listado de productos> ${error.message}`
//         })
//     }
// }

export const getProductById = async (req, res) => {
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
}

export const createProduct = async (req, res) => { // { "title": "Mouse inalámbrico Logitech M720", "description": "Mouse ergonómico con conexión Bluetooth y receptor USB.", "code": "MOU-002", "price": 120, "status": true, "stock": 30, "category": "Oficina", "thumbnails": ["images/mouse-logitech.jpg"] }
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
}

export const updateProduct = async(req, res) => { // { "price": 350, "stock": 99}
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
}

export const deleteProduct = async(req, res) => {
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
}