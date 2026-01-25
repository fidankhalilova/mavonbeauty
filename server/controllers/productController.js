const Product = require('../models/Products');
const fs = require('fs');
const path = require('path');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { homePage } = req.query;
        
        let query = {};
        
        // Filter by homePage if specified
        if (homePage !== undefined) {
            query.homePage = homePage === 'true';
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
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

// Create product with multiple images
const createProduct = async (req, res) => {
    try {
        const { name, brand, color, size, weight, price, stock, description, homePage } = req.body;

        // Validation
        if (!name || !brand || weight === undefined || price === undefined) {
            // Delete uploaded files if validation fails
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '..', 'uploads', 'products', file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
            
            return res.status(400).json({
                success: false,
                message: 'Please provide name, brand, weight and price'
            });
        }

        // Prepare product data
        const productData = {
            name,
            brand,
            color: color || '',
            size: size || '',
            weight,
            price,
            stock: stock || 0,
            description: description || '',
            homePage: homePage === 'true' || homePage === true || false
        };

        // Add images if uploaded
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
        }

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        // Delete uploaded files if product creation fails
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', 'uploads', 'products', file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Update product with optional new images
const updateProduct = async (req, res) => {
    try {
        const { name, brand, color, size, weight, price, stock, description, homePage } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            // Delete uploaded files if product not found
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    const filePath = path.join(__dirname, '..', 'uploads', 'products', file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
            }
            
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update fields
        if (name) product.name = name;
        if (brand) product.brand = brand;
        if (color !== undefined) product.color = color;
        if (size !== undefined) product.size = size;
        if (weight !== undefined) product.weight = weight;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (description !== undefined) product.description = description;
        if (homePage !== undefined) product.homePage = homePage === 'true' || homePage === true;

        // Add new images if uploaded (don't delete old ones, just append)
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            product.images = [...(product.images || []), ...newImages];
            
            // Limit to 5 images max
            if (product.images.length > 5) {
                // Delete excess old images from filesystem
                const imagesToDelete = product.images.slice(0, product.images.length - 5);
                imagesToDelete.forEach(img => {
                    const imagePath = path.join(__dirname, '..', img);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });
                product.images = product.images.slice(-5);
            }
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        // Delete uploaded files if update fails
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', 'uploads', 'products', file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        
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
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete associated images
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                const imagePath = path.join(__dirname, '..', img);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        await product.deleteOne();

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

// Delete specific image from product
const deleteProductImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        // Remove image from array
        product.images = product.images.filter(img => img !== imageUrl);

        // Delete image file
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete image',
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
    deleteProductImage,
    getStats
};