const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const connectDb = require('./db/ConnectDb');
const cors = require('cors');
const path = require('path');

const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const brandRouter = require("./routers/brandRouter");
const colorRouter = require("./routers/colorRouter");
const sizeRouter = require("./routers/sizeRouter");

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDb();

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/sizes", sizeRouter);


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

