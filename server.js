const jsonServer = require('json-server');
const express = require('express');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const app = express();

// Serve images using Express
app.use('/images', express.static(path.join(__dirname, 'images')));

server.use(middlewares);

// Custom route for creating a new user
server.post('/users', (req, res, next) => {
  const email = req.body.email;
  const existingUser = router.db.get('users').find({ email }).value();

  if (existingUser) {
    res.status(400).json({ error: 'Email already exists' });
  } else {
    next();
  }
});

// Apply the JSON Server router
server.use(router);

// Use the Express JSON parser middleware
app.use(express.json());

// Use the JSON Server within the Express app
app.use(server);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
