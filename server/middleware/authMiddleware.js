// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userSchema');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        console.log('========== AUTH MIDDLEWARE DEBUG ==========');
        console.log('Request path:', req.path);
        console.log('Request method:', req.method);

        let token = null;

        // 1. Check Authorization header (Bearer token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('✓ Token found in Authorization header');
        }

        // 2. Check for common custom headers
        const customHeaders = [
            'x-auth-token',
            'x-access-token',
            'x-token',
            'authorization-token',
            'access-token',
            'token'
        ];

        for (const header of customHeaders) {
            const headerValue = req.headers[header];
            if (!token && headerValue) {
                token = headerValue;
                console.log(`✓ Token found in ${header}`);
                break;
            }
        }

        // 3. Check cookies
        if (!token && req.cookies) {
            const cookieNames = ['token', 'accessToken', 'auth_token', 'jwt'];
            for (const cookieName of cookieNames) {
                if (req.cookies[cookieName]) {
                    token = req.cookies[cookieName];
                    console.log(`✓ Token found in cookie: ${cookieName}`);
                    break;
                }
            }
        }

        // 4. Check query parameters
        if (!token && req.query) {
            const queryParams = ['token', 'access_token', 'auth_token', 'jwt'];
            for (const param of queryParams) {
                if (req.query[param]) {
                    token = req.query[param];
                    console.log(`✓ Token found in query param: ${param}`);
                    break;
                }
            }
        }

        // 5. Check body
        if (!token && req.body) {
            const bodyFields = ['token', 'accessToken', 'authToken', 'jwt'];
            for (const field of bodyFields) {
                if (req.body[field]) {
                    token = req.body[field];
                    console.log(`✓ Token found in body field: ${field}`);
                    break;
                }
            }
        }

        if (!token) {
            console.log('✗ NO TOKEN FOUND');
            return res.status(401).json({
                success: false,
                message: 'No authentication token found'
            });
        }

        console.log('Token found, length:', token.length);
        console.log('Token preview:', token.substring(0, 30) + '...');

        // ========== ACTUAL TOKEN VERIFICATION LOGIC ==========
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.SECURITY_KEY);
            console.log('✅ Token verified successfully');
            console.log('Decoded payload:', {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null
            });

            // Find user in database
            const user = await UserModel.findById(decoded.userId).select('-password -refreshToken');

            if (!user) {
                console.log('❌ User not found for ID:', decoded.userId);
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Attach user to request
            req.user = user;
            req.isAuthenticated = true;
            req.token = token;

            console.log(`✅ Authentication successful for: ${user.email}`);

            // Call next to continue to the route handler
            next();

        } catch (jwtError) {
            console.error('❌ JWT Verification error:', jwtError.name, jwtError.message);

            // Handle expired token with refresh logic
            if (jwtError.name === 'TokenExpiredError') {
                console.log('🔄 Token expired, attempting refresh...');

                // Check for refresh token
                let refreshToken = null;

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
                        message: 'Token expired. No refresh token available.'
                    });
                }

                try {
                    // Verify refresh token
                    const refreshDecoded = jwt.verify(refreshToken, process.env.SECURITY_KEY);

                    if (refreshDecoded.type !== 'refresh') {
                        return res.status(401).json({
                            success: false,
                            message: 'Invalid refresh token type'
                        });
                    }

                    // Find user with refresh token
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

                    // Generate new refresh token
                    const newRefreshToken = jwt.sign(
                        {
                            userId: user._id,
                            type: 'refresh'
                        },
                        process.env.SECURITY_KEY,
                        { expiresIn: '7d' }
                    );

                    // Update user's refresh token
                    user.refreshToken = newRefreshToken;
                    await user.save();

                    // Attach to request
                    req.user = user;
                    req.newAccessToken = newAccessToken;
                    req.newRefreshToken = newRefreshToken;
                    req.isAuthenticated = true;
                    req.newTokenIssued = true;

                    console.log('✅ Token refreshed successfully for:', user.email);
                    next();

                } catch (refreshError) {
                    console.error('❌ Refresh token error:', refreshError.message);

                    if (refreshError.name === 'TokenExpiredError') {
                        return res.status(401).json({
                            success: false,
                            message: 'Refresh token expired. Please log in again.'
                        });
                    }

                    return res.status(401).json({
                        success: false,
                        message: 'Invalid refresh token'
                    });
                }

            } else if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token',
                    error: jwtError.message
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Token verification failed',
                    error: jwtError.message
                });
            }
        }

    } catch (error) {
        console.error('❌ Unexpected authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            error: error.message
        });
    }
};

// Middleware to send new tokens if generated
const sendNewTokensIfAvailable = (req, res, next) => {
    // If new tokens were generated, send them in the response
    if (req.newAccessToken) {
        console.log('📤 Sending new tokens in response');

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

// Combined authentication middleware (use this in your routes)
const authMiddleware = async (req, res, next) => {
    await verifyToken(req, res, next);
};

// Simple auth middleware without auto-refresh (for specific cases)
const simpleAuthMiddleware = (req, res, next) => {
    try {
        console.log('Simple auth middleware called');

        // Get token from header
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECURITY_KEY);

        // Add user to request (just the decoded token, no DB lookup)
        req.user = decoded;
        req.isAuthenticated = true;
        next();

    } catch (error) {
        console.error('Simple auth error:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
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

        // If using simpleAuthMiddleware, user might not have role from DB
        const userRole = req.user.role || 'user';

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Role ${userRole} is not authorized to access this resource`
            });
        }

        next();
    };
};

// Optional: Require authentication (check if user is authenticated)
const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

// Export all middleware functions
module.exports = {
    verifyToken,           // Raw token verification with refresh logic
    sendNewTokensIfAvailable, // Send new tokens in response
    authMiddleware,        // Main middleware (verify + send tokens) - USE THIS
    simpleAuthMiddleware,  // Simple verification without DB/refresh
    authorizeRoles,        // Role-based authorization
    requireAuth           // Check if authenticated
};