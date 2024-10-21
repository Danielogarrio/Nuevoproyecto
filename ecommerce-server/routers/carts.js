const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dataPath = path.join(__dirname, '../data/carts.json');
const productsPath = path.join(__dirname, '../data/products.json');


const readCarts = () => {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
};

const writeCarts = (carts) => {
    fs.writeFileSync(dataPath, JSON.stringify(carts, null, 2));
};

//  para leer los productos
const readProducts = () => {
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
};

// Ruta POST / - Crea un nuevo carrito
router.post('/', (req, res) => {
    let carts = readCarts();

    const newCart = {
        id: (carts.length ? parseInt(carts[carts.length - 1].id) + 1 : 1).toString(),
        products: []
    };

    carts.push(newCart);
    writeCarts(carts);

    res.status(201).json(newCart);
});

// Ruta GET /:cid - Lista los productos de un carrito específico
router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();

    const cart = carts.find(c => c.id === cid);
    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

// Ruta POST /:cid/product/:pid - Agrega un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    let carts = readCarts();
    let products = readProducts();

    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productExists = products.some(p => p.id === pid);
    if (!productExists) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const productIndexInCart = carts[cartIndex].products.findIndex(p => p.product === pid);

    if (productIndexInCart === -1) {
        // Si el producto no esta en el carrito, agregarlo con cantidad 1
        carts[cartIndex].products.push({ product: pid, quantity: 1 });
    } else {
        // Si ya esta entonces incrementa la cantidad
        carts[cartIndex].products[productIndexInCart].quantity += 1;
    }

    writeCarts(carts);
    res.status(201).json(carts[cartIndex].products);
});

module.exports = router;