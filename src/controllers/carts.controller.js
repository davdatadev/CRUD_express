import CartModel from '../models/carts.model.js'
import ProductModel from '../models/products.model.js'

// POST/
export const createCart = async (req, res) => {
    console.log("Crear carrito - MongoDB")
    try {
        const nuevoCarrito = await CartModel.create({ products: [] })
        res.status(201).json({
            mensaje: "POST",
            status: "Carrito creado correctamente",
            carrito: nuevoCarrito
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: "POST", error: "Error al crear el carrito" })
    }
}

// GET/:CID
export const getCartById = async (req, res) => {
    console.log("Listar productos de carrito especifico - MongoDB")
    try {
        const { cid } = req.params
        
        const carrito = await CartModel.findById(cid).populate('products.product').lean()

        if (!carrito) {
            return res.status(404).json({
                mensaje: "GET",
                error: `No se encontró ningún carrito con el id ${cid}`
            })
        }

        res.status(200).json({
            mensaje: "GET",
            carrito: carrito.products
        })
    } catch (error) {
        console.log("Error buscando el carrito")
        res.status(500).json({ mensaje: "GET", error: `Error al buscar el carrito` })
    }
}

// POST/:CID/product/:PID
export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params

        const carrito = await CartModel.findById(cid)
        if (!carrito) {
            return res.status(404).json({ mensaje: "POST", error: `Carrito ${cid} no encontrado` })
        }

        const productoExiste = await ProductModel.findById(pid)
        if (!productoExiste) {
             return res.status(404).json({ mensaje: "POST", error: `Producto ${pid} no encontrado` })
        }

        // Validar si producto en carrito y toString ya que id es un ObjectId
        const productoEnCarritoIndex = carrito.products.findIndex(p => p.product.toString() === pid)

        if (productoEnCarritoIndex > -1) {
            carrito.products[productoEnCarritoIndex].quantity += 1
        } else {
            carrito.products.push({ product: pid, quantity: 1 })
        }

        const resultado = await carrito.save()

        res.status(200).json({
            mensaje: "POST",
            status: "Producto agregado al carrito",
            carrito: resultado
        })


    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ mensaje: "POST", error: "Error al agregar producto a carrito" })
    }
}

// DELETE/carts/:cid/products/:pid
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        const carrito = await CartModel.findByIdAndUpdate(
            cid, 
            { $pull: { products: { product: pid } } }, // Con pull eliminamos el producto del array
            { new: true } // Devuelve el carrito actualizado
        );

        if (!carrito) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.status(200).json({
            status: "success", 
            message: "Producto eliminado del carrito", 
            payload: carrito 
        });
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
}

// PUT/carts/:cid
export const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body; //[{ product: id, quantity: 10 }, ...]

        const carrito = await CartModel.findByIdAndUpdate(
            cid, 
            { products: products }, 
            { new: true }
        );

        if (!carrito) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.status(200).json({
            status: "success", 
            message: "Carrito actualizado", 
            payload: carrito 
        });
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
}

// PUT/carts/:cid/products/:pid
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const carrito = await CartModel.findById(cid);
        if (!carrito) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        const productIndex = carrito.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) return res.status(404).json({status: "error", message: "Producto no encontrado en el carrito"});

        carrito.products[productIndex].quantity = quantity;
        
        await carrito.save();
        
        res.status(200).json({
            status: "success", 
            message: "Cantidad actualizada", 
            payload: carrito 
        });
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
}

// DELETE/carts/:cid (vaciar carrito)
export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        
        const carrito = await CartModel.findByIdAndUpdate(
            cid, 
            { products: [] },
            { new: true }
        );

        if (!carrito) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.status(200).json({
            status: "success", 
            message: "Carrito vaciado", 
            payload: carrito 
        });
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
}