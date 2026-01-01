import Meal from "../models/Meal.js";

export const createMeal = async (req, res) => {
  try {
    // req.user MUST come from auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { mealType, foods, moodAfter, notes, photo } = req.body;

    // basic validation
    if (!mealType || !foods) {
      return res.status(400).json({ message: "Meal type and foods are required" });
    }

    const meal = await Meal.create({
      userId: req.user.id,
      mealType,
      foods,
      moodAfter,
      notes,
      photo
    });

    return res.status(201).json(meal);
  } catch (error) {
    console.error("Create meal error:", error);
    return res.status(500).json({ message: "Failed to create meal" });
  }
};
