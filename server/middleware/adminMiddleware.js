// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    // Check if user is authenticated and has admin role
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }

    // For API routes
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
    });
};

module.exports = adminMiddleware;