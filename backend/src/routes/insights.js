const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient()
const { authenticateToken } = require('../middleware/authMid');
const { answerInsightQuestion } = require('../services/aiService');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access denied' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid token' });
//     }
//     req.user = user; 
//     next();
//   });
// };

router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Fetch user's recent meals for context
    const recentMeals = await prisma.userMeal.findMany({
      where: { userId: req.user.userId },
      include: {
        moodLogs: {
          select: { moodState: true, intensity: true }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    // Format logs for the AI prompt
    const userLogs = recentMeals.map(meal => ({
      foods: meal.foods,
      moodLogs: meal.moodLogs
    }));

    const answer = await answerInsightQuestion(question, userLogs);
    
    res.json({ success: true, answer });
  } catch (error) {
    console.error('Error in /chat:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

router.get('/mood-calendar', authenticateToken, async (req, res) => {
  try {
    const view = req.query.view;

    const now = new Date();
    let startDate = null;

    if (view === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (view === "month") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const meals = await prisma.userMeal.findMany({
      where: {
        userId: req.user.userId,
        ...(startDate && { timestamp: { gte: startDate } })
      },
      include: {
        moodLogs: { 
          select: { 
            moodState: true, 
            intensity: true 
          } 
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    const calendar = {};

    meals.forEach(meal => {
      const date = meal.timestamp.toISOString().split("T")[0];

      if (!calendar[date]) {
        calendar[date] = {
          date,
          mealCount: 0,
          moodScores: {}
        };
      }

      calendar[date].mealCount++;

      // Use moodLogs instead of moods
      meal.moodLogs.forEach(m => {
        if (!calendar[date].moodScores[m.moodState]) {
          calendar[date].moodScores[m.moodState] = 0;
        }
        calendar[date].moodScores[m.moodState] += m.intensity || 0;
      });
    });

    const result = Object.values(calendar).map(day => {
      const mood = Object.entries(day.moodScores)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

      return {
        date: day.date,
        mealCount: day.mealCount,
        mood
      };
    });

    return res.json({ calendarData: result });
  } catch (error) {
    console.error('Error in /mood-calendar:', error);
    res.status(500).json({ error: "Failed to fetch calendar data", details: error.message });
  }
});

router.post('/achievements', authenticateToken, async (req, res) => {
  const { satisfactionRating } = req.body;

  if (!satisfactionRating || satisfactionRating < 1 || satisfactionRating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }

  try {
    const swaps = await prisma.cravingSwaps.findMany({
      where: {
        userId: req.user.userId,
        satisfactionRating: satisfactionRating
      },
    });

    res.json({ swaps, total: swaps.length });
  } catch (error) {
    console.error('Error in POST /achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements.', details: error.message });
  }
});

router.get('/patterns', authenticateToken, async (req, res) => {
  try {
    const meals = await prisma.userMeal.findMany({
      where: { userId: req.user.userId },
      include: {
        moodLogs: {
          select: {
            moodState: true,
            intensity: true,
            timestamp: true
          }
        }
      },
      orderBy: { timestamp: 'asc' }
    });

    const foodMoodMap = {};
    const timeMoodMap = {};

    meals.forEach(meal => {
      // mood derived from moodLogs
      
      if (!meal.foods) return;

      const foods = meal.foods
        .split(',')
        .map(f => f.trim().toLowerCase())
        .filter(f => f.length > 0);


      // mood change or calculating from moodLogs timestamps
      let moodImproved = false;
      let moodDeclined = false;
      
      if (meal.moodBefore && meal.moodAfter) {
        // string comparison for intensity values
        moodImproved = meal.moodAfter === 'happy' || meal.moodAfter === 'energetic';
        moodDeclined = meal.moodAfter === 'sad' || meal.moodAfter === 'stressed';
      } else if (meal.moodLogs.length >= 2) {
        // sort by timestamp
        const sortedLogs = [...meal.moodLogs].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        const before = sortedLogs[0];
        const after = sortedLogs[sortedLogs.length - 1];
        
        if (before.intensity && after.intensity) {
          moodImproved = after.intensity > before.intensity;
          moodDeclined = after.intensity < before.intensity;
        }
      }

      foods.forEach(food => {
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

        if (moodImproved) {
          foodMoodMap[food].moodImprovement++;
        } else if (moodDeclined) {
          foodMoodMap[food].moodDecline++;
        } else {
          foodMoodMap[food].moodStable++;
        }
      });
      
      // Calculate Time-based patterns
      const hour = new Date(meal.timestamp).getHours();
      let timeBlock = 'other';
      if (hour >= 5 && hour < 11) timeBlock = 'morning';
      else if (hour >= 11 && hour < 15) timeBlock = 'lunch';
      else if (hour >= 15 && hour < 18) timeBlock = 'afternoon';
      else if (hour >= 18 || hour < 5) timeBlock = 'evening';

      if (!timeMoodMap[timeBlock]) {
        timeMoodMap[timeBlock] = {
          count: 0,
          moodImprovement: 0,
          moodDecline: 0,
          moodStable: 0
        };
      }
      
      timeMoodMap[timeBlock].count++;
      if (moodImproved) timeMoodMap[timeBlock].moodImprovement++;
      else if (moodDeclined) timeMoodMap[timeBlock].moodDecline++;
      else timeMoodMap[timeBlock].moodStable++;
    });

    const topFoods = Object.values(foodMoodMap)
      .filter(f => f.count >= 2)
      .sort((a, b) => b.moodImprovement - a.moodImprovement)
      .slice(0, 10);

    // Generate signals from timeMoodMap
    const signals = [];
    Object.entries(timeMoodMap).forEach(([block, data]) => {
      if (data.count >= 2) { // Need at least 2 meals to form a pattern
        const total = data.moodImprovement + data.moodDecline + data.moodStable;
        if (data.moodDecline / total >= 0.5) {
          signals.push({
             type: 'negative',
             timeBlock: block,
             title: `${block.charAt(0).toUpperCase() + block.slice(1)} Pattern`,
             text: `${block.charAt(0).toUpperCase() + block.slice(1)} meals often correlate with a dip in energy or lower mood.`
          });
        } else if (data.moodImprovement / total >= 0.5) {
          signals.push({
             type: 'positive',
             timeBlock: block,
             title: `${block.charAt(0).toUpperCase() + block.slice(1)} Boost`,
             text: `You tend to feel energized and positive after your ${block} meals.`
          });
        } else if (data.moodStable / total >= 0.5) {
          signals.push({
             type: 'stable',
             timeBlock: block,
             title: `Early Signal`,
             text: `You tend to feel stable/neutral after ${block} meals.`
          });
        }
      }
    });

    return res.json({
      topMoodBoostingFoods: topFoods,
      timeSignals: signals,
      weeklyTrend: {},
      totalMealsLogged: meals.length
    });
  } catch (error) {
    console.error('Error in /patterns:', error);
    res.status(500).json({ error: 'Failed to fetch patterns', details: error.message });
  }
});

router.get('/achievements', authenticateToken, async (req, res) => {
  try {
    const meals = await prisma.userMeal.findMany({
      where: { userId: req.user.userId },
      orderBy: { timestamp: 'asc' }, 
      include: { moodLogs: true }
    });

    if (meals.length === 0) {
      return res.json({ 
        message: 'No meals logged yet', 
        achievements: {
          maxStreak: 0,
          balancedDayCount: 0,
          newFoodsTried: []
        }
      });
    }

    //streak
    let streak = 1;
    let maxStreak = 1;
    for (let i = 1; i < meals.length; i++) {
      const prevDay = new Date(meals[i - 1].timestamp).setHours(0,0,0,0);
      const currDay = new Date(meals[i].timestamp).setHours(0,0,0,0);
      if (currDay - prevDay === 86400000) { 
        streak++;
        if (streak > maxStreak) maxStreak = streak;
      } else if (currDay !== prevDay) {
        streak = 1;
      }
    }

    //balanced days
    const balancedDays = {};
    meals.forEach(meal => {
      const date = meal.timestamp.toISOString().split('T')[0];
      if (!balancedDays[date]) {
        balancedDays[date] = { foods: new Set(), moodGood: false };
      }

      if (meal.foods) {
        meal.foods.split(',').forEach(f => {
          const food = f.trim().toLowerCase();
          if (food) balancedDays[date].foods.add(food);
        });
      }

      // mood improved or not
      if (meal.moodAfter && (meal.moodAfter === 'happy' || meal.moodAfter === 'energetic')) {
        balancedDays[date].moodGood = true;
      } else if (meal.moodLogs.length >= 2) {
        const sortedLogs = [...meal.moodLogs].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        const before = sortedLogs[0];
        const after = sortedLogs[sortedLogs.length - 1];
        if (after.intensity && before.intensity && after.intensity >= before.intensity) {
          balancedDays[date].moodGood = true;
        }
      }
    });

    const balancedDayCount = Object.values(balancedDays)
      .filter(d => d.moodGood && d.foods.size >= 3).length;

    //no. of foods tried
    const seenFoods = new Set();
    const newFoods = [];
    meals.forEach(meal => {
      if (meal.foods) {
        meal.foods.split(',').forEach(f => {
          const food = f.trim().toLowerCase();
          if (food && !seenFoods.has(food)) {
            newFoods.push(food);
            seenFoods.add(food);
          }
        });
      }
    });

    res.json({
      achievements: {
        maxStreak,
        balancedDayCount,
        newFoodsTried: newFoods
      }
    });

  } catch (error) {
    console.error('Error in GET /achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements', details: error.message });
  }
});

module.exports = router;