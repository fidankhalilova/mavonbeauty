const Product = require('../models/Products');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, brand, color, size, weight, price, stock } = req.body;

        // Validation
        if (!name || !brand || weight === undefined || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, brand, weight and price'
            });
        }

        const product = await Product.create({
            name,
            brand,
            color: color || '',
            size: size || '',
            weight,
            price,
            stock: stock || 0
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { name, brand, color, size, weight, price, stock } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, brand, color, size, weight, price, stock },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};

// Get statistics
const getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalStockResult = await Product.aggregate([
            { $group: { _id: null, total: { $sum: '$stock' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalStock: totalStockResult[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getStats
};