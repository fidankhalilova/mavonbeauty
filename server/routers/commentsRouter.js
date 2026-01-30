const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/commentSchema');
const Product = require('../models/Products');
const User = require('../models/userSchema');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET all comments (with filtering options)
router.get('/', async (req, res) => {
    try {
        const { productId, userId, sortBy = 'createdAt', order = 'desc' } = req.query;

        let filter = {};

        if (productId) filter.product = productId;
        if (userId) filter.user = userId;

        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        const comments = await Comment.find(filter)
            .populate('product', 'name')
            .populate('user', 'name email')
            .sort(sort);

        res.json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET comments for specific product
router.get('/product/:productId', async (req, res) => {
    try {
        console.log('Fetching comments for product:', req.params.productId);

        const { sortBy = 'createdAt', order = 'desc', limit = 50 } = req.query;

        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        // First, let's check if the product exists
        const productExists = await Product.findById(req.params.productId);
        if (!productExists) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Fetch comments
        const comments = await Comment.find({
            product: req.params.productId, // MongoDB can handle string to ObjectId conversion
        })
            .populate('user', 'name email')
            .sort(sort)
            .limit(parseInt(limit));

        console.log(`Found ${comments.length} comments for product ${req.params.productId}`);

        // Calculate average rating - FIXED VERSION
        const ratingStats = await Comment.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(req.params.productId) // Use new keyword
                }
            },
            {
                $group: {
                    _id: '$product',
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                    ratingCounts: {
                        $push: '$rating'
                    }
                }
            }
        ]);

        console.log('Rating stats:', ratingStats);

        const stats = ratingStats[0] || {
            averageRating: 0,
            totalRatings: 0,
            ratingCounts: []
        };

        res.json({
            success: true,
            data: comments,
            stats: {
                averageRating: stats.averageRating ? parseFloat(stats.averageRating.toFixed(1)) : 0,
                totalRatings: stats.totalRatings || 0,
                ratingDistribution: [1, 2, 3, 4, 5].map(star => ({
                    star,
                    count: stats.ratingCounts ? stats.ratingCounts.filter(r => r === star).length : 0
                }))
            }
        });
    } catch (error) {
        console.error('Error in /product/:productId route:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// POST create new comment/rating (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        // Validate input
        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, rating, and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user has already commented on this product
        const existingComment = await Comment.findOne({
            product: productId,
            user: req.user.id
        });

        if (existingComment) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Create new comment (NO approval needed)
        const newComment = new Comment({
            product: productId,
            user: req.user.id,
            rating,
            comment
            // removed: approved: false
        });

        await newComment.save();

        // Populate user info for response
        await newComment.populate('user', 'name');

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully!',
            data: newComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// PUT update comment (only by owner or admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the owner or admin
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this comment'
            });
        }

        const { rating, comment: commentText } = req.body;

        if (rating) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 1 and 5'
                });
            }
            comment.rating = rating;
        }

        if (commentText) {
            comment.comment = commentText;
        }

        await comment.save();

        res.json({
            success: true,
            message: 'Comment updated successfully',
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// DELETE comment (only by owner or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is admin or comment owner
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        await comment.deleteOne();

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// GET comment statistics
router.get('/stats/overall', async (req, res) => {
    try {
        const stats = await Comment.aggregate([
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    totalProducts: { $addToSet: '$product' },
                    totalUsers: { $addToSet: '$user' }
                }
            },
            {
                $project: {
                    totalComments: 1,
                    averageRating: { $round: ['$averageRating', 1] },
                    totalProducts: { $size: '$totalProducts' },
                    totalUsers: { $size: '$totalUsers' }
                }
            }
        ]);

        const ratingDistribution = await Comment.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            success: true,
            data: {
                overall: stats[0] || {
                    totalComments: 0,
                    averageRating: 0,
                    totalProducts: 0,
                    totalUsers: 0
                },
                ratingDistribution: ratingDistribution.map(item => ({
                    star: item._id,
                    count: item.count
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;