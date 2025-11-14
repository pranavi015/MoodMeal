const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

// This function checks if the user is logged in before running any analysis.
// It uses the special code (JWT) sent with the request to confirm the user's identity.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    // If the token is good, we attach the user's ID to the request for later use.
    req.user = user; 
    next();
  });
};

router.get('/mood-calendar', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // 1. Prepare the database query
    let whereClause = { userId: req.user.userId };

    if (startDate && endDate) {
      whereClause.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // 2. Fetch all meals and their related moods in one go (very efficient!)
    const meals = await prisma.meal.findMany({
      where: whereClause,
      // We use 'include' to automatically get the linked MoodLog data.
      include: {
        moods: {
          select: {
            timeContext: true,
            intensity: true,
            moodState: true,
          }
        }
      },
      orderBy: { timestamp: 'desc' }
    });
    
    // 3. Organize data by date
    const calendarData = {};
    meals.forEach(meal => {
      const date = meal.timestamp.toISOString().split('T')[0]; // Gets the date part (YYYY-MM-DD)
      
      if (!calendarData[date]) {
        calendarData[date] = {
          date,
          meals: [],
          moodIntensities: [] // Temporary place to store all mood numbers for the day
        };
      }
      
      // Add meal details
      calendarData[date].meals.push({
          id: meal.id,
          mealType: meal.mealType,
          foods: meal.foods,
          timestamp: meal.timestamp,
          moods: meal.moods, // Attach the full mood details
      });
      
      // Collect all mood numbers for the daily average
      meal.moods.forEach(mood => {
          if (mood.intensity) {
              calendarData[date].moodIntensities.push(mood.intensity);
          }
      });
    });
    
    // 4. Calculate the average mood for each day
    const result = Object.values(calendarData).map(day => {
        const totalIntensity = day.moodIntensities.reduce((sum, intensity) => sum + intensity, 0);
        const avgMoodIntensity = day.moodIntensities.length > 0
            ? (totalIntensity / day.moodIntensities.length).toFixed(2) // Calculate average
            : null;
            
        delete day.moodIntensities; // Remove the temporary number list
        
        return {
            ...day,
            avgMoodIntensity: parseFloat(avgMoodIntensity) // The main number for the calendar
        };
    });
    
    res.json({ calendarData: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

router.post('/achievements', authenticateToken, async (req, res) => {
  const { satisfactionRating } = req.body;

  if (!satisfactionRating || satisfactionRating < 1 || satisfactionRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  try {
    // Example: fetch all swaps for the user that meet satisfaction criteria
    const swaps = await prisma.cravingSwaps.findMany({
      where: {
        userId: req.user.userId,
        satisfactionRating: satisfactionRating
      },
    });

    res.json({ swaps, total: swaps.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch achievements.' });
  }
});

router.get('/patterns', authenticateToken, async (req, res) => {
  try {
    // 1. Fetch all meals and moods again (efficiently with 'include')
    const meals = await prisma.meal.findMany({
      where: { userId: req.user.userId },
      include: {
        moods: {
          select: {
            timeContext: true,
            intensity: true
          }
        }
      }
    });
    
    // 2. Analyze mood improvements by food
    const foodMoodMap = {};
    
    meals.forEach(meal => {
      // Find the two crucial moods: Pre-Meal and Post-Meal
      const preMood = meal.moods.find(m => m.timeContext === 'Pre-Meal');
      const postMood = meal.moods.find(m => m.timeContext === 'Post-Meal');

      // Check if we have reliable data (both moods must exist)
      if (preMood && postMood && preMood.intensity && postMood.intensity) {
        const preIntensity = preMood.intensity;
        const postIntensity = postMood.intensity;

        // Split the "foods" string into a list of individual items
        const foods = meal.foods.split(',').map(f => f.trim().toLowerCase()).filter(f => f.length > 0);
        
        foods.forEach(food => {
          // Initialize the counter for this food if it's the first time seeing it
          if (!foodMoodMap[food]) {
            foodMoodMap[food] = {
              food,
              count: 0,
              moodImprovement: 0,
              moodDecline: 0,
              moodStable: 0
            };
          }
          
          foodMoodMap[food].count++;
          
          // Use the reliable numerical intensity for comparison (THE CRITICAL FIX!)
          if (postIntensity > preIntensity) {
            foodMoodMap[food].moodImprovement++; // Mood got better
          } else if (postIntensity < preIntensity) {
            foodMoodMap[food].moodDecline++;    // Mood got worse
          } else {
            foodMoodMap[food].moodStable++;     // Mood stayed the same
          }
        });
      }
    });
    
    // 3. Find the Top 10 Mood-Boosting Foods
    const topFoods = Object.values(foodMoodMap)
      .filter(f => f.count >= 2) // Only show foods logged at least twice
      .sort((a, b) => b.moodImprovement - a.moodImprovement) // Sort by most improvements
      .slice(0, 10);
    
    // 4. Calculate Weekly Mood Trends
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Date from 7 days ago
    
    const recentMeals = meals.filter(m => new Date(m.timestamp) >= sevenDaysAgo);
    
    const weeklyTrend = {
      totalMeals: recentMeals.length,
      avgMoodBefore: 0,
      avgMoodAfter: 0,
      moodImprovement: 0
    };
    
    let beforeSum = 0, afterSum = 0, count = 0;
    
    recentMeals.forEach(meal => {
        const preMood = meal.moods.find(m => m.timeContext === 'Pre-Meal');
        const postMood = meal.moods.find(m => m.timeContext === 'Post-Meal');
        
        if (preMood && postMood && preMood.intensity && postMood.intensity) {
            beforeSum += preMood.intensity;
            afterSum += postMood.intensity;
            count++;
        }
    });
    
    if (count > 0) {
      const avgBefore = beforeSum / count;
      const avgAfter = afterSum / count;
      
      weeklyTrend.avgMoodBefore = avgBefore.toFixed(2);
      weeklyTrend.avgMoodAfter = avgAfter.toFixed(2);
      // Mood improvement is the overall change in the weekly average
      weeklyTrend.moodImprovement = (avgAfter - avgBefore).toFixed(2); 
    }
    
    res.json({
      topMoodBoostingFoods: topFoods,
      weeklyTrend,
      totalMealsLogged: meals.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patterns' });
  }
});

router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      where: { userId: req.user.userId },
      orderBy: { timestamp: 'asc' }, // ascending for streak calculation
      include: { moods: true }
    });

    if (meals.length === 0) return res.json({ message: 'No meals logged yet', achievements: {} });

    // 1. Streaks calculation
    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < meals.length; i++) {
      const prevDay = new Date(meals[i - 1].timestamp).setHours(0,0,0,0);
      const currDay = new Date(meals[i].timestamp).setHours(0,0,0,0);
      if (currDay - prevDay === 86400000) { // difference of 1 day in ms
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else if (currDay !== prevDay) {
        streak = 1;
      }
    }

    // 2. Balanced days calculation
    const balancedDays = {};
    meals.forEach(meal => {
      const preMood = meal.moods.find(m => m.timeContext === 'Pre-Meal');
      const postMood = meal.moods.find(m => m.timeContext === 'Post-Meal');

      const date = meal.timestamp.toISOString().split('T')[0];
      if (!balancedDays[date]) balancedDays[date] = { foods: new Set(), moodGood: false };

      // Count foods
      meal.foods.split(',').forEach(f => balancedDays[date].foods.add(f.trim().toLowerCase()));

      // Mood check
      if (preMood && postMood && postMood.intensity >= preMood.intensity) {
        balancedDays[date].moodGood = true;
      }
    });

    const balancedDayCount = Object.values(balancedDays)
      .filter(d => d.moodGood && d.foods.size >= 3).length;

    // 3. New foods
    const seenFoods = new Set();
    const newFoods = [];
    meals.forEach(meal => {
      meal.foods.split(',').forEach(f => {
        const food = f.trim().toLowerCase();
        if (!seenFoods.has(food)) {
          newFoods.push(food);
          seenFoods.add(food);
        }
      });
    });

    res.json({
      achievements: {
        maxStreak,
        balancedDayCount,
        newFoodsTried: newFoods
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

module.exports = router;

