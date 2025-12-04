const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const insightsRoutes = require('./routes/insights');
const swapsRoutes = require('./routes/swaps');
const feedRoutes = require("./routes/feed");
const userRoutes = require('./routes/user');

const app = express();

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
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);  
app.use('/api/insights', insightsRoutes); 
app.use('/api/swaps', swapsRoutes);
app.use("/api/feed", feedRoutes);
app.use('/user', userRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'MoodMeal API is running!' });
});

if(process.env.NODE_ENV === "development"){
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;