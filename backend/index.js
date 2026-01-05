const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json())

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authRoutes = require('./src/routes/auth');
const mealRoutes = require('./src/routes/meals');
const insightsRoutes = require('./src/routes/insights');
const swapsRoutes = require('./src/routes/swaps');
const feedRoutes = require("./src/routes/feed");
const userRoutes = require('./src/routes/user');

app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "https://mood-meal-web.vercel.app",
      "http://localhost:5173",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);  
app.use('/api/insights', insightsRoutes); 
app.use('/api/swaps', swapsRoutes);
app.use("/api/feed", feedRoutes);
app.use('/user', userRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'MoodMeal API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app;