// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userSchema');

const verifyToken = async (req, res, next) => {
    try {
        let token = null;

        // 1. Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // 2. Check cookie (if using cookies)
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // 3. Check query parameter (for testing)
        if (!token && req.query && req.query.token) {
            token = req.query.token;
        }

        // 4. Check body (last resort)
        if (!token && req.body && req.body.token) {
            token = req.body.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        try {
            // Try to verify access token
            const decoded = jwt.verify(token, process.env.SECURITY_KEY);

            // Find user by ID
            const user = await UserModel.findById(decoded.userId).select('-password -refreshToken');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Attach user to request object
            req.user = user;
            req.token = token; // Store original token
            next();

        } catch (accessTokenError) {
            // If access token is expired, check if there's a refresh token
            if (accessTokenError.name === 'TokenExpiredError') {
                // Check for refresh token in multiple places
                let refreshToken = null;

                // Check in the same places as access token
                if (req.cookies && req.cookies.refreshToken) {
                    refreshToken = req.cookies.refreshToken;
                } else if (req.body && req.body.refreshToken) {
                    refreshToken = req.body.refreshToken;
                } else if (req.query && req.query.refreshToken) {
                    refreshToken = req.query.refreshToken;
                }

                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: 'Access token expired. No refresh token provided.'
                    });
                }

                // Verify refresh token
                const refreshDecoded = jwt.verify(refreshToken, process.env.SECURITY_KEY);

                if (refreshDecoded.type !== 'refresh') {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid refresh token type'
                    });
                }

                // Find user by refresh token
                const user = await UserModel.findOne({
                    _id: refreshDecoded.userId,
                    refreshToken: refreshToken
                }).select('-password');

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid refresh token'
                    });
                }

                // Generate new access token
                const newAccessToken = jwt.sign(
                    {
                        userId: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role || 'user'
                    },
                    process.env.SECURITY_KEY,
                    { expiresIn: '15m' }
                );

                // Generate new refresh token (optional - rotate refresh tokens)
                const newRefreshToken = jwt.sign(
                    {
                        userId: user._id,
                        type: 'refresh'
                    },
                    process.env.SECURITY_KEY,
                    { expiresIn: '7d' }
                );

                // Update user's refresh token in database
                user.refreshToken = newRefreshToken;
                await user.save();

                // Attach user and new tokens to request
                req.user = user;
                req.newAccessToken = newAccessToken;
                req.newRefreshToken = newRefreshToken;
                req.token = newAccessToken; // Use new token for this request

                next();
            } else {
                // Other JWT errors
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                    error: accessTokenError.message
                });
            }
        }
    } catch (error) {
        console.error('Token verification error:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

// Middleware to send new tokens if generated
const sendNewTokensIfAvailable = (req, res, next) => {
    // If new tokens were generated, send them in the response
    if (req.newAccessToken) {
        // Send new access token in response header
        res.set('X-New-Access-Token', req.newAccessToken);

        // Set new access token as cookie if using cookies
        res.cookie('token', req.newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 minutes
            sameSite: 'strict'
        });

        // If new refresh token was generated, send it too
        if (req.newRefreshToken) {
            res.cookie('refreshToken', req.newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'strict'
            });
        }
    }

    // Continue to the next middleware or route handler
    if (typeof next === 'function') {
        next();
    }
};

// Combine both middlewares into one for easier use
const authMiddleware = async (req, res, next) => {
    await verifyToken(req, res, (err) => {
        if (err) {
            return next(err);
        }
        sendNewTokensIfAvailable(req, res, next);
    });
};

// Add role-based authorization middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized to access this resource`
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    sendNewTokensIfAvailable,
    authMiddleware, // Use this as the main middleware
    authorizeRoles
};