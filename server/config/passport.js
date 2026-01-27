// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;
// const jwt = require('jsonwebtoken');
// const User = require('../models/userSchema'); // Import your User model

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: process.env.GITHUB_CALLBACK_URL,
//     scope: ['user:email']
// },
//     async function (accessToken, refreshToken, profile, done) {
//         try {
//             console.log('GitHub profile received:', profile.username);

//             // Find user by GitHub ID or email
//             const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
//             let user = await User.findOne({
//                 $or: [
//                     { githubId: profile.id },
//                     { email: email }
//                 ]
//             });

//             if (!user) {
//                 // Create new user
//                 user = await User.create({
//                     githubId: profile.id,
//                     name: profile.displayName || profile.username,
//                     email: email,
//                     avatar: profile.photos?.[0]?.value,
//                     login: profile.username,
//                     emailVerified: true
//                 });
//                 console.log('New user created:', user._id);
//             } else if (!user.githubId) {
//                 // Link GitHub to existing account
//                 user.githubId = profile.id;
//                 user.avatar = profile.photos?.[0]?.value;
//                 user.login = profile.username;
//                 await user.save();
//                 console.log('GitHub linked to existing user:', user._id);
//             }

//             // Generate tokens
//             const tokenData = {
//                 userId: user._id,
//                 email: user.email,
//                 name: user.name,
//                 avatar: user.avatar
//             };

//             const accessToken = jwt.sign(tokenData, process.env.SECURITY_KEY, { expiresIn: '15m' });
//             const refreshToken = jwt.sign(
//                 { userId: user._id, type: 'refresh' },
//                 process.env.SECURITY_KEY,
//                 { expiresIn: '7d' }
//             );

//             // Add tokens to user object that gets passed to serializeUser
//             const userWithTokens = {
//                 ...user.toObject(),
//                 accessToken,
//                 refreshToken
//             };

//             console.log('Tokens generated for user:', user._id);
//             return done(null, userWithTokens);

//         } catch (error) {
//             console.error('Passport GitHub strategy error:', error);
//             return done(error, null);
//         }
//     }));

// // Serialize user WITH tokens
// passport.serializeUser((user, done) => {
//     // Store the entire user object with tokens
//     done(null, user);
// });

// // Deserialize user
// passport.deserializeUser(async (user, done) => {
//     try {
//         // If we have a full user object from serialize, use it
//         if (user._id) {
//             return done(null, user);
//         }
//         // Otherwise fetch from DB
//         const dbUser = await User.findById(user);
//         done(null, dbUser);
//     } catch (error) {
//         done(error, null);
//     }
// });

// module.exports = passport;

// config/passport.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            console.log('GitHub profile received:', profile.username);

            const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
            let user = await User.findOne({
                $or: [
                    { githubId: profile.id },
                    { email: email }
                ]
            });

            if (!user) {
                // Create new user
                user = await User.create({
                    githubId: profile.id,
                    name: profile.displayName || profile.username,
                    email: email,
                    avatar: profile.photos?.[0]?.value,
                    login: profile.username,
                    emailVerified: true,
                    role: 'user' // Default role for GitHub users
                });
                console.log('New GitHub user created:', user._id);
            } else if (!user.githubId) {
                // Link GitHub to existing account
                user.githubId = profile.id;
                user.avatar = profile.photos?.[0]?.value;
                user.login = profile.username;
                await user.save();
                console.log('GitHub linked to existing user:', user._id);
            }

            // Generate tokens
            const tokenData = {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'user',
                avatar: user.avatar
            };

            const accessToken = jwt.sign(
                tokenData,
                process.env.SECURITY_KEY,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { userId: user._id, type: 'refresh' },
                process.env.SECURITY_KEY,
                { expiresIn: '7d' }
            );

            // Save refresh token to database
            user.refreshToken = refreshToken;
            await user.save();

            // Return user with tokens
            const userWithTokens = {
                ...user.toObject(),
                accessToken,
                refreshToken
            };

            console.log('GitHub login successful for user:', user._id);
            return done(null, userWithTokens);

        } catch (error) {
            console.error('Passport GitHub strategy error:', error);
            return done(error, null);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    try {
        if (user._id) {
            return done(null, user);
        }
        const dbUser = await User.findById(user);
        done(null, dbUser);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;