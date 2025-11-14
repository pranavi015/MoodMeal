// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { PrismaClient } = require('@prisma/client');

// const router = express.Router();
// const prisma = new PrismaClient();

// // Signup endpoint
// router.post('/signup', async (req, res) => {
//   try {
//     const { email, password, name } = req.body;
    
//     // Check if user already exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }
    
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name
//       }
//     });
    
//     res.status(201).json({ 
//       message: 'User created successfully', 
//       userId: user.id 
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ error: 'Signup failed. Please try again.' });
//   }
// });

// // Login endpoint
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Find user
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
    
//     // Check password
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }
    
//     // Check JWT_SECRET
//     if (!process.env.JWT_SECRET) {
//       throw new Error('JWT_SECRET is not configured');
//     }
    
//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );
    
//     res.json({ 
//       token, 
//       user: { 
//         id: user.id, 
//         email: user.email, 
//         name: user.name 
//       } 
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Login failed. Please try again.' });
//   }
// });

// module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message});
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

module.exports = router;