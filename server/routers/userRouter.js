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
    VerifyResetToken
} = require('../controllers/AuthController');

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
router.get('/users', GetAllUsersController);
router.delete('/users/:id', DeleteUserController);
router.put('/users/:id', UpdateUserController);

// Session user
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                displayName: req.user.displayName,
                avatar: req.user.photos[0]?.value,
                profileUrl: req.user.profileUrl
            }
        });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout error' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;