const UserModel = require("../models/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require("../utils/mailer");
const passport = require('../config/passport');

const GetAllUsersController = async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password');

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found."
            });
        }

        res.status(200).json({
            success: true,  // Add this
            message: "Users fetched successfully",
            data: users  // Change from userList to data
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

const AuthRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8 || password.length > 20) {
            return res.status(400).json({
                message: "Password must be between 8 and 20 characters"
            });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const payload = {
            name,
            email,
            password: hashedPassword
        };

        const user = await UserModel.create(payload);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "User registration failed",
            error: error.message
        });
    }
};

const AuthLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,  // ← Add this
            message: "Email and password are required"
        });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (!existingUserByEmail) {
        return res.status(404).json({
            success: false,  // ← Add this
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUserByEmail.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,  // ← Add this
            message: "Invalid password"
        });
    }

    const token = jwt.sign({
        userId: existingUserByEmail._id,
        email: existingUserByEmail.email
    }, process.env.SECURITY_KEY, { expiresIn: '1h' });

    // Set cookie (optional)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    // Return response in the format frontend expects
    res.status(200).json({
        success: true,  // ← This is crucial!
        message: "Login successful",
        token,
        user: {
            _id: existingUserByEmail._id,
            name: existingUserByEmail.name,
            email: existingUserByEmail.email
        }
    });
}

const DeleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: { _id: deletedUser._id }
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const UpdateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if email is being changed to an existing email
        if (email && email !== existingUser.email) {
            const emailExists = await UserModel.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already exists." });
            }
        }

        const updateData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
            updatedAt: Date.now()
        };

        // If password is provided, hash it
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long"
                });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, select: '-password' }
        );

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const AuthGithubCallback = async (req, res) => {
    try {
        console.log("=== GitHub Callback Started ===");
        console.log("req.user:", req.user);

        if (!req.user || !req.user.accessToken) {
            console.log("ERROR: No user or tokens from GitHub");
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=github_failed`);
        }

        const userWithTokens = req.user;

        // Extract user data (without sensitive info)
        const userData = {
            _id: userWithTokens._id,
            name: userWithTokens.name,
            email: userWithTokens.email,
            avatar: userWithTokens.avatar
        };

        // URL encode the data
        const encodedUserData = encodeURIComponent(JSON.stringify(userData));

        // Redirect with tokens in URL
        res.redirect(
            `${process.env.FRONTEND_URL}/?accessToken=${userWithTokens.accessToken}&refreshToken=${userWithTokens.refreshToken}&user=${encodedUserData}&source=github`
        );

    } catch (error) {
        console.error('❌ GitHub callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=github_error`);
    }
};

// const AuthGithubCallback = async (req, res) => {
//     console.log("=== GitHub Callback Started ===");
//     console.log("req.user:", req.user);

//     if (!req.user) {
//         console.log("ERROR: No user data from GitHub");
//         return res.redirect(`${process.env.FRONTEND_URL}/login?error=github_failed`);
//     }

//     const githubUser = req.user;
//     console.log("GitHub user received:", githubUser.username);

//     const userData = {
//         id: githubUser.id,
//         username: githubUser.username,
//         name: githubUser.displayName || githubUser.username,
//         email: githubUser.emails?.[0]?.value || `${githubUser.username}@github.com`,
//         avatar: githubUser.photos?.[0]?.value,
//         source: 'github'
//     };

//     // 🔑 ACCESS TOKEN (short-lived)
//     const accessToken = jwt.sign(
//         userData,
//         process.env.SECURITY_KEY,
//         { expiresIn: '15m' }
//     );

//     // 🔁 REFRESH TOKEN (long-lived)
//     const refreshToken = jwt.sign(
//         { id: userData.id },
//         process.env.SECURITY_KEY, // Use same secret or create REFRESH_SECRET in .env
//         { expiresIn: '7d' }
//     );

//     res.cookie('accessToken', accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 3600000
//     });

//     res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         maxAge: 3600000
//     });

//     console.log("Tokens generated for:", userData.username);

//     res.status(200).json({
//         success: true,  // ← This is crucial!
//         message: "Login successful",
//         accessToken,
//         refreshToken,
//         user: {
//             _id: userData._id,
//             name: userData.name,
//             email: userData.email
//         }
//     });

//     if (error) {
//         console.error('❌ GitHub callback error:', error);
//         // On error, redirect to login page
//         res.redirect(`${process.env.FRONTEND_URL}/login?error=github_error`);
//     }
// };

const RefreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.SECURITY_KEY,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};


// ========== FORGOT PASSWORD ==========
const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            // For security, don't reveal if user exists
            return res.status(200).json({
                success: true,
                message: "If an account exists with this email, you will receive a password reset link"
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set token and expiration (1 hour)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email
        const emailSent = await sendPasswordResetEmail(email, resetToken);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send reset email. Please try again."
            });
        }

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
};

// ========== RESET PASSWORD ==========
const ResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Hash the token to compare with stored hash
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await UserModel.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        await sendPasswordChangedEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Password reset successful. You can now login with your new password."
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
};

// ========== VERIFY RESET TOKEN ==========
const VerifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }

        // Hash the token
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Check if token is valid and not expired
        const user = await UserModel.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        res.status(200).json({
            success: true,
            message: "Token is valid"
        });

    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    AuthRegister,
    AuthLogin,
    DeleteUserController,
    UpdateUserController,
    GetAllUsersController,

    AuthGithubCallback,
    ForgotPassword,
    ResetPassword,
    VerifyResetToken,
    RefreshToken
};