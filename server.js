const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const next = require('next'); // Import Next.js
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Create the Next.js app
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Connect to the database
connectDB();

// Prepare the Next.js app
nextApp.prepare().then(() => {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '500mb' })); // Parse JSON requests
  app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 100000 })); // Parse URL-encoded requests
  app.use(morgan('dev')); // Log HTTP requests

  // API Routes
  const userRoutes = require('./routes/user');
  const logRoutes = require('./routes/logout');
  const amplifyRoutes = require('./routes/amplify'); // Import amplify routes
  const deleteRoutes = require('./routes/deleteRoutes');

  app.use('/api/auth', deleteRoutes);
  app.use('/api/auth', amplifyRoutes); // Use amplify routes
  app.use('/api/auth', userRoutes); // User routes
  
  app.use('/api/auth', logRoutes); // Logout routes

  // Handle Next.js requests
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on: ${PORT}`.blue.underline.bold);
  });
});