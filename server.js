const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
//const path = require('path');

//dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware
app.use(express.json({ limit: "500mb" })); // Parse JSON requests
app.use(express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 100000 })); // Parse URL-encoded requests
app.use(morgan('dev')); // Log HTTP requests

// Connect to the database
connectDB();

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Routes
const userRoutes = require('./routes/user');
const logRoutes = require('./routes/logout');
const amplifyRoutes = require('./routes/amplify'); // Import amplify routes
const deleteRoutes = require("./routes/deleteRoutes");

app.use(express.static('./'));


app.use(express.json());
app.use("/api/auth", deleteRoutes);
app.use("/api/auth", amplifyRoutes); // Use amplify routes
app.use('/api/auth', userRoutes); // User routes
app.use('/api/auth', logRoutes); // Logout routes

// Favicon handling
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Root route

// Define PORT and start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on: ${PORT}`.blue.underline.bold));
