const express = require('express');
const router = express.Router();

let products = [
    { id: 101, name: 'Ergonomic Mechanical Keyboard', price: 89.99, stock: 15 },
    { id: 102, name: 'Precision Wireless Mouse', price: 49.99, stock: 25 },
    { id: 103, name: 'Ultra-wide 4K Monitor', price: 399.00, stock: 8 }
];

// GET /api/products
router.get('/products', (req, res) => {
    res.json({ success: true, count: products.length, data: products });
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id, 10));
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
});

// POST /api/products
router.post('/products', (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ success: false, error: 'Please provide product name and price' });
    }

    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 101,
        name,
        price: parseFloat(price),
        stock: parseInt(stock || 0, 10)
    };

    products.push(newProduct);
    res.status(201).json({ success: true, message: 'Product created', data: newProduct });
});

// PUT /api/products/:id
router.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id, 10));
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const { name, price, stock } = req.body;
    if (name) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock, 10);

    res.json({ success: true, message: 'Product updated', data: product });
});

// DELETE /api/products/:id
router.delete('/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id, 10));
    if (index === -1) return res.status(404).json({ success: false, error: 'Product not found' });

    const [deleted] = products.splice(index, 1);
    res.json({ success: true, message: 'Product deleted', data: deleted });
});

module.exports = router;
