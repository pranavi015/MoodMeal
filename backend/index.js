// const express = require('express');
// const app = express();

// const authRoutes = require('./routes/auth');  
// const mealRoutes = require('./routes/meals');
// const insightsRoutes = require('./routes/insights');
// const swapsRoutes = require('./routes/swaps');

// app.use(express.json());  

// app.use('/api/meals', mealRoutes);  
// app.use('/api/auth', authRoutes);
// app.use('/api/insights', insightsRoutes); 
// app.use('/api/swaps', swapsRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors'); // UNCOMMENTED
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const insightsRoutes = require('./routes/insights');
const swapsRoutes = require('./routes/swaps');

const app = express();

// Middleware
app.use(cors()); // ENABLED CORS
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);  
app.use('/api/insights', insightsRoutes); 
app.use('/api/swaps', swapsRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MoodMeal API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});