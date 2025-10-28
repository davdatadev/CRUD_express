import fs from "fs/promises"
import { CARTS_PATH } from "../const/constantes.js"

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

export default CartsManager