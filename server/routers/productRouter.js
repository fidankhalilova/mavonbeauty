const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // multer config
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    getStats
} = require('../controllers/productController');

// Stats route (should be before /:id route)
router.get('/stats', getStats);

// Product routes
router.route('/')
    .get(getAllProducts)
    .post(upload.array('images', 5), createProduct); // Accept up to 5 images

router.route('/:id')
    .get(getProduct)
    .put(upload.array('images', 5), updateProduct) // Accept up to 5 images
    .delete(deleteProduct);

// Delete specific product image
router.delete('/:id/image', deleteProductImage);

module.exports = router;