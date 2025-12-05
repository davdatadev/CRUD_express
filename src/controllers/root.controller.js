import ProductModel from '../models/products.model.js';

export const rootHandler = async (req, res) => {
    try {
        let { page = 1, limit = 5, sort, query } = req.query
        
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

        // 6. Renderizar vista con TODOS los datos
        res.render("home", { 
            titulo: "Home Page - Groseries Boom",
            bienvenida: "¡Bienvenido a la aplicación groseries-boom!",
            products: productos,
            page: page,
            totalPages: totalPages,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevPage,
            nextLink: nextPage,
            // Para conservar los filtros en la vista
            currentQuery: query,
            currentSort: sort
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("error", { error: "Error al cargar los productos" });
    }
}

export const productsViewHandler = async (req, res) => {
    try {
        let { page = 1, limit = 5, sort, query } = req.query
        
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

        // 6. Renderizar vista con TODOS los datos
        res.render("home", { 
            titulo: "Home Page - Groseries Boom",
            bienvenida: "¡Bienvenido a la aplicación groseries-boom!",
            products: productos,
            page: page,
            totalPages: totalPages,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevPage,
            nextLink: nextPage,
            // Para conservar los filtros en la vista
            currentQuery: query,
            currentSort: sort
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("error", { error: "Error al cargar los productos" });
    }
}

