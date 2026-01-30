const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getOrderStats
} = require('../controllers/OrderController');

// User routes (authenticated users)
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

// Admin routes (admin only)
router.get('/', authMiddleware, authorizeRoles('admin'), getAllOrders);
router.put('/:id/status', authMiddleware, authorizeRoles('admin'), updateOrderStatus);
router.get('/stats/overview', authMiddleware, authorizeRoles('admin'), getOrderStats);

module.exports = router;