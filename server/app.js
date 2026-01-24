const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const connectDb = require('./db/ConnectDb');
const cors = require('cors');
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add body parser middleware BEFORE routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

connectDb();

// Routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/products", productRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});