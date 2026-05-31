const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const predefinedMeals = [
  { name: "Quinoa Buddha Bowl", time: "15 min", tags: ["Vegan", "High Protein"], imageUrl: "/food-bowl.jpg", category: "healthy" },
  { name: "Avocado Toast", time: "10 min", tags: ["Vegetarian", "Quick"], imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2070&q=80", category: "healthy" },
  { name: "Berry Smoothie Bowl", time: "5 min", tags: ["Breakfast", "Antioxidants"], imageUrl: "/food-bowl.jpg", category: "healthy" },
  { name: "Mediterranean Salad", time: "12 min", tags: ["Light", "Fresh"], imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2070&q=80", category: "healthy" },
  { name: "Grilled Salmon Asparagus", time: "20 min", tags: ["Omega-3", "Low Carb"], imageUrl: "/food-bowl.jpg", category: "healthy" },
  { name: "Sweet Potato Chickpea Curry", time: "25 min", tags: ["Vegan", "Comfort Food"], imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2070&q=80", category: "healthy" }
];

async function main() {
  console.log("Clearing existing meals...");
  await prisma.curatedMeal.deleteMany();
  
  console.log("Seeding meals...");
  for (const meal of predefinedMeals) {
    await prisma.curatedMeal.create({
      data: {
        name: meal.name,
        time: meal.time,
        tags: meal.tags,
        imageUrl: meal.imageUrl,
        category: meal.category
      }
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
