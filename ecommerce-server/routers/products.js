const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dataPath = path.join(__dirname, '../data/products.json');


const readProducts = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
};

// Ruta GET / - Lista todos los productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = readProducts();
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Ruta GET /:pid -para obtener un producto por su ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
});

// Ruta POST / - Agrega un nuevo producto
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    const products = readProducts();
    const newProduct = {
        id: (products.length ? parseInt(products[products.length - 1].id) + 1 : 1).toString(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

module.exports = router;



router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails, status } = req.body;

    let products = readProducts();
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // para actualizar solo los campos enviados desde el body menos el id
    const updatedProduct = {
        ...products[productIndex],
        title: title || products[productIndex].title,
        description: description || products[productIndex].description,
        code: code || products[productIndex].code,
        price: price || products[productIndex].price,
        stock: stock || products[productIndex].stock,
        category: category || products[productIndex].category,
        thumbnails: thumbnails || products[productIndex].thumbnails,
        status: typeof status === 'boolean' ? status : products[productIndex].status
    };

    products[productIndex] = updatedProduct;
    writeProducts(products);

    res.json(updatedProduct);
});

// Ruta DELETE /:pid - para que se elimine un producto por su ID
router.delete('/:pid', (req, res) => {
    const { pid } = req.params;

    let products = readProducts();
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    //  para liminar producto
    products.splice(productIndex, 1);
    writeProducts(products);

    res.status(200).json({ message: 'Producto eliminado correctamente' });
});

module.exports = router;