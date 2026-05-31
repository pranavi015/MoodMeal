const Groq = require('groq-sdk');

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// We'll use llama-3.1-8b-instant as the default fast model
const DEFAULT_MODEL = "llama-3.1-8b-instant";

/**
 * Generate a recipe based on fridge ingredients
 */
const generateFridgeRecipe = async (ingredients) => {
  try {
    const prompt = `You are an expert chef. Create a healthy recipe using some or all of these ingredients: ${ingredients.join(", ")}. You may also assume basic pantry staples (salt, pepper, olive oil) are available.
    
    Return the recipe EXACTLY as a JSON object with this structure:
    {
      "name": "Recipe Name",
      "time": "e.g., 20 min",
      "difficulty": "Easy/Medium/Hard",
      "description": "A short, appetizing description.",
      "instructions": [
        "Step 1...",
        "Step 2..."
      ]
    }
    
    Do not return any other text, just the raw JSON object.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe from AI.");
  }
};

/**
 * Suggest a healthy swap for a craving
 */
const generateHealthySwap = async (craving) => {
  try {
    const prompt = `You are a holistic nutritionist. A user is craving: "${craving}". 
    Suggest a healthy, mood-boosting alternative that hits the same spot (e.g., sweet, salty, crunchy, creamy).
    
    Return EXACTLY as a JSON object with this structure:
    {
      "suggestion": "Name of the healthy alternative",
      "reason": "Explain why this is a good swap and how it boosts mood/energy.",
      "matchScore": "e.g., 95%"
    }
    
    Do not return any other text, just the raw JSON object.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 512,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating swap:", error);
    throw new Error("Failed to generate swap from AI.");
  }
};

/**
 * Answer food-mood insight questions
 */
const answerInsightQuestion = async (question, userLogs) => {
  try {
    const prompt = `You are "MoodMeal AI", a friendly, empathetic food-mood coach. 
    The user is asking: "${question}"
    
    Here is a summary of their recent meal and mood logs for context:
    ${JSON.stringify(userLogs)}
    
    Provide a helpful, insightful answer explaining the science of how food affects mood. If their question relates to their logs, reference them. If it's a general question (like "why do pancakes make me tired"), explain the biological reason (e.g., blood sugar spikes). Keep it conversational, encouraging, and concise (under 4 sentences).`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful, empathetic food-mood coach."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 512,
    });

    return chatCompletion.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error answering insight:", error);
    throw new Error("Failed to get answer from AI.");
  }
};

/**
 * Generate dynamic healthy meals for the Discover feed
 */
const generateDiscoverMeals = async () => {
  try {
    const prompt = `You are a culinary AI for MoodMeal. 
    Generate EXACTLY 4 healthy, creative, and appealing meal ideas for a healthy lifestyle.
    
    Return EXACTLY as a JSON array of objects with no markdown formatting.
    Each object must have these exactly 4 properties:
    - "name": string (creative name)
    - "time": string (e.g., "15 min")
    - "tags": array of 2 strings (e.g., ["Vegan", "High Protein"])
    - "image": string (choose ONE of these exact paths based on the meal type: "/images/about-food.png", "/images/hero-food.png", "/images/card-smoothie.png", "/images/card-salad.png")

    JSON format:
    {
      "meals": [
        { "name": "Meal Name", "time": "X min", "tags": ["Tag1", "Tag2"], "image": "..." }
      ]
    }`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.8,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const parsed = JSON.parse(responseContent);
    return parsed.meals || [];
  } catch (error) {
    console.error("Error generating discover meals:", error);
    throw new Error("Failed to generate meals from AI.");
  }
};

/**
 * Generate a recipe for a healthy swap suggestion
 */
const generateSwapRecipe = async (suggestion) => {
  try {
    const prompt = `You are a culinary expert. Generate a healthy recipe for: "${suggestion}".
    Provide the recipe in EXACTLY this JSON format:
    {
      "name": "Name of the dish",
      "servings": "Number of servings this makes (e.g. 2 servings)",
      "time": "Total prep & cook time",
      "ingredients": ["Ingredient 1", "Ingredient 2"],
      "instructions": ["Step 1", "Step 2"]
    }
    Do not return any other text, just the raw JSON object.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: DEFAULT_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(responseContent);
  } catch (error) {
    console.error("Error generating swap recipe:", error);
    throw new Error("Failed to generate recipe from AI.");
  }
};

module.exports = {
  generateFridgeRecipe,
  generateHealthySwap,
  answerInsightQuestion,
  generateDiscoverMeals,
  generateSwapRecipe
};
