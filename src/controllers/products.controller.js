import ProductModel from '../models/products.model.js'

// GET/
export const getAllProducts = async (req, res) => {
    console.log("Listar productos - MongoDB - HTML")
    try{
        let { page = 1, limit = 6, sort, query } = req.query

        limit = parseInt(limit)
        page = parseInt(page)

        // Filtro por categoría o estado
        let filter = {}
        if (query) {
           if (query.toLowerCase() === 'true' || query.toLowerCase() === 'false') {
               filter.status = query.toLowerCase() === 'true'
           } else {
               filter.category = query
           }
        }

        // Ordenamiento
        let sortOption = {}
        if (sort) {
            if (sort.toLowerCase() === 'asc') {
                sortOption.price = 1
            } else if (sort.toLowerCase() === 'desc') {
                sortOption.price = -1
            } 
        }

        const skip = (page - 1) * limit

        const totalDocs = await ProductModel.countDocuments(filter)

        const productos = await ProductModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean()

        const totalPages = Math.ceil(totalDocs / limit)
        const hasPrevPage = page > 1
        const hasNextPage = page < totalPages

        const buildUrl = (targetPage) => {
            let url = `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${targetPage}&limit=${limit}`
            if (query) url += `&query=${query}`
            if (sort) url += `&sort=${sort}`
            return url
        }

        const prevPage = hasPrevPage ? buildUrl(page - 1) : null
        const nextPage = hasNextPage ? buildUrl(page + 1) : null

        res.status(200).json({
            status: "success",
            payload: productos,
            totalPages: totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevPage,
            nextLink: nextPage
        })
    }catch(error){
        console.log("Error")
        res.status(500).json({ mensaje: "GET", error: `Error al consultar los productos> ${error.message}` })
    }
}

// GET/:PID
export const getProductById = async (req, res) => {
    console.log("Buscar producto")
    try {
        const { pid } = req.params
        const producto = await ProductModel.findById(pid)
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

// POST/
export const createProduct = async (req, res) => {
    console.log("Crear producto")
    try{
        const nuevoProducto = req.body
        if (!nuevoProducto) {
            return res.status(400).json({  mensaje: "POST", error: "No se recibió ningún producto" })
        }
        const estadoProducto = await ProductModel.create(nuevoProducto)
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

// PUT/:PID
export const updateProduct = async(req, res) => { // { "price": 350, "stock": 99}
    console.log("Actualizar producto")
    try {
        const nuevosDatos = req.body
        if (!nuevosDatos || Object.keys(nuevosDatos).length === 0) {
            return res.status(400).json({  mensaje: "PUT", error: "No se recibió ningún producto" })
        }

        const producto = await ProductModel.findByIdAndUpdate(req.params.pid, nuevosDatos)

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

// DELETE/:PID
export const deleteProduct = async(req, res) => {
    try {
        const producto = await ProductModel.findByIdAndDelete(req.params.pid)
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