import fs from "fs/promises"
import { PRODUCTS_PATH } from "../const/const.js"

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
            const productos = await this.leerProductos()
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
                ...productos[productIndex],
                ...camposActualizados
            }

            productos[productIndex] = productoActualizado
            await fs.writeFile(PRODUCTS_PATH, JSON.stringify(productos, null, 2))

            return productoActualizado
        } catch (error) {
            console.error("Error actualizando un producto:", error)
        }
    }

    async eliminarProducto(productId) {
        try {
            const productos = await this.leerProductos()
            const productIndex = productos.findIndex(prod => prod.id == productId)

            if (productIndex === -1) {
                return null
            }
            
            productoEliminado = productos[productIndex]
            productos.splice(productIndex, 1)
            await fs.writeFile(PRODUCTS_PATH, JSON.stringify(productos, null, 2))

            return productoEliminado
        } catch (error) {
            console.error("Error eliminando producto:", error)
            throw error
        }
    }
}