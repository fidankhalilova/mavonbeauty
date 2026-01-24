const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getStats
} = require('../controllers/productController');

// Stats route (should be before /:id route)
router.get('/stats', getStats);

// Product routes
router.route('/')
    .get(getAllProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;