// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Basic middleware
app.use(express.json());

// Sample API route
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Add your other API routes here
// app.get('/api/books', ...)
// app.post('/api/books', ...)

// For all other routes, return 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export the serverless function
module.exports.handler = serverless(app);
