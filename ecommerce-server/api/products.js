import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Filtros dinámicos
        const filter = query
            ? { $or: [{ category: query }, { status: query === 'true' }] }
            : {};

        // Ordenamiento
        const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        // Paginar y buscar
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOptions,
        };

        const products = await Product.paginate(filter, options);

        // Respuesta formateada
        res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};