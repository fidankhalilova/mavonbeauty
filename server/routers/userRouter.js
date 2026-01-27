const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const {
    AuthRegister,
    AuthLogin,
    AuthGithubCallback,
    GetAllUsersController,
    DeleteUserController,
    UpdateUserController,
    ForgotPassword,
    ResetPassword,
    RefreshToken,
    VerifyResetToken,
    UpdateUserRole,
    GetCurrentUser
} = require('../controllers/AuthController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Import the combined authMiddleware
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// ========== AUTH ROUTES ==========
// GitHub OAuth
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    AuthGithubCallback
);

// Regular auth
router.post('/register', AuthRegister);
router.post('/login', AuthLogin);
router.post('/forgot-password', ForgotPassword);
router.post('/reset-password', ResetPassword);
router.post('/refresh-token', RefreshToken);
router.get('/verify-reset-token', VerifyResetToken);

// User management
router.get('/users', authMiddleware, authorizeRoles('admin'), GetAllUsersController);
router.delete('/users/:id', authMiddleware, authorizeRoles('admin'), DeleteUserController);
router.put('/users/:id', authMiddleware, UpdateUserController);
router.put('/users/:id/role', authMiddleware, authorizeRoles('admin'), UpdateUserRole);

// Get current user - use the combined authMiddleware
router.get('/user', authMiddleware, GetCurrentUser);

// Session user (fallback for passport sessions)
router.get('/session-user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: {
                id: req.user.id,
                username: req.user.username,
                displayName: req.user.displayName,
                avatar: req.user.photos?.[0]?.value,
                profileUrl: req.user.profileUrl
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout error'
            });
        }
        // Clear cookies if using JWT
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// Test endpoint to verify middleware is working
router.get('/test-auth', authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Authentication successful!',
        user: req.user,
        isAuthenticated: req.isAuthenticated,
        newTokenIssued: req.newTokenIssued || false
    });
});

module.exports = router;