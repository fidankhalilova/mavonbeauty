const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./db/ConnectDb');
require('dotenv').config();
const passport = require('./config/passport');  // Import passport config
const authRouter = require('./routers/userRouter');  // Import auth routes
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const brandRouter = require("./routers/brandRouter");
const colorRouter = require("./routers/colorRouter");
const sizeRouter = require("./routers/sizeRouter");
const orderRouter = require("./routers/orderRouter");
const commentRoutes = require('./routers/commentsRouter');

const app = express();
const path = require('path');

const PORT = process.env.PORT || 3001;

// Middleware - EXACT same as before
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['X-New-Access-Token'], // For token refresh
    maxAge: 86400 // 24 hours
}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1 gün
    }
}));

connectDb();

// Initialize passport (same as before, but imported)
app.use(passport.initialize());
app.use(passport.session());

// Use the auth router (routes are exactly the same, just moved to separate file)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/sizes", sizeRouter);
app.use("/api/v1/orders", orderRouter);
app.use('/api/v1/comments', commentRoutes);


app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
