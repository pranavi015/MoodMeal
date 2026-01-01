const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json())

const authRoutes = require('./src/routes/auth');
const mealRoutes = require('./src/routes/meals');
const insightsRoutes = require('./src/routes/insights');
const swapsRoutes = require('./src/routes/swaps');
const feedRoutes = require("./src/routes/feed");
const userRoutes = require('./src/routes/user');

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://mood-meal-web.vercel.app",
  "http://localhost:5173"

];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // simple DB query
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

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