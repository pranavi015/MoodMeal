const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const curatedMeals = [
    // --- Energizing Meals ---
    { 
      name: "Sunrise Crunch Power Bowl",
      category: "energizing",
      description: "Warm quinoa tossed with roasted peppers, crispy chickpeas, and a dreamy lemon-tahini drizzle.",
      imageUrl: "https://source.unsplash.com/featured/?quinoa,bowl,healthy"
    },
    { 
      name: "Golden Avocado Egg Smash",
      category: "energizing",
      description: "Thick sourdough loaded with buttery smashed avocado and a soft jammy egg on top.",
      imageUrl: "https://source.unsplash.com/featured/?avocado,toast,egg"
    },
    { 
      name: "Berry Bliss Parfait",
      category: "energizing",
      description: "Creamy yogurt layered with juicy berries, honey swirls, and crunchy granola clusters.",
      imageUrl: "https://source.unsplash.com/featured/?parfait,berries,yogurt"
    },
    { 
      name: "Warm Chickpea Street Wrap",
      category: "energizing",
      description: "Toasty wrap stuffed with spiced chickpeas, charred spinach, and zesty garlic hummus.",
      imageUrl: "https://source.unsplash.com/featured/?wrap,chickpea,healthy"
    },

    // --- Comforting Meals ---
    { 
      name: "Smoky Sweet Potato Chili Bowl",
      category: "comforting",
      description: "Slow-simmered chili with tender sweet potatoes, black beans, and cozy spices.",
      imageUrl: "https://source.unsplash.com/featured/?chili,bowl,comfortfood"
    },
    { 
      name: "Creamy Coconut Curry Hug",
      category: "comforting",
      description: "Velvety coconut curry loaded with red lentils, warm spices, and soft veggies.",
      imageUrl: "https://source.unsplash.com/featured/?curry,coconut,lentils"
    },
    { 
      name: "Garlic-Herb Turkey Meatball Bake",
      category: "comforting",
      description: "Juicy turkey meatballs baked in a bubbling roasted tomato sauce.",
      imageUrl: "https://source.unsplash.com/featured/?meatballs,tomato,sauce"
    },
    { 
      name: "Sticky Veggie Stir-Fry Bowl",
      category: "comforting",
      description: "Colorful veggies tossed in a glossy soy-ginger glaze over fluffy rice.",
      imageUrl: "https://source.unsplash.com/featured/?stirfry,vegetables,asian"
    },

    // --- Mood Boosting Meals ---
    { 
      name: "Citrus Glazed Salmon Bowl",
      category: "mood-boosting",
      description: "Perfectly roasted salmon with a tangy citrus glaze over warm rice and greens.",
      imageUrl: "https://source.unsplash.com/featured/?salmon,bowl,healthy"
    },
    { 
      name: "Midnight Chocolate Mood Smoothie",
      category: "mood-boosting",
      description: "Rich cocoa, banana, and almond milk blended into a dessert-like pick-me-up.",
      imageUrl: "https://source.unsplash.com/featured/?chocolate,smoothie"
    },
    { 
      name: "Berry Glow-Up Salad",
      category: "mood-boosting",
      description: "Sweet berries tossed with crunchy seeds and a light citrus poppy dressing.",
      imageUrl: "https://source.unsplash.com/featured/?berry,salad,healthy"
    },
    { 
      name: "Fluffy Banana Oat Dreamcakes",
      category: "mood-boosting",
      description: "Soft, cinnamon-kissed pancakes made from bananas and oats.",
      imageUrl: "https://source.unsplash.com/featured/?banana,pancakes,healthy"
    },

    // --- Focus / Brain Fuel ---
    { 
      name: "Green Goddess Glow Bowl",
      category: "focus",
      description: "Kale, quinoa, avocado, pumpkin seeds, and a creamy herbed dressing.",
      imageUrl: "https://source.unsplash.com/featured/?greenbowl,healthy,kale"
    },
    { 
      name: "Herby Veggie Omelette Stack",
      category: "focus",
      description: "A fluffy omelette packed with peppers, spinach, and melty cheese vibes—minus the cheese.",
      imageUrl: "https://source.unsplash.com/featured/?omelette,veggies,breakfast"
    },
    { 
      name: "Ginger Sesame Edamame Rice",
      category: "focus",
      description: "Toasted brown rice with tender edamame and a drizzle of ginger-sesame magic.",
      imageUrl: "https://source.unsplash.com/featured/?edamame,rice,asian"
    },

    // --- Light & Refreshing ---
    { 
      name: "Cool Cucumber Splash Salad",
      category: "refreshing",
      description: "Crisp cucumber ribbons with mint, lemon, and a chilled honey drizzle.",
      imageUrl: "https://source.unsplash.com/featured/?cucumber,salad,fresh"
    },
    { 
      name: "Citrus Fire Grilled Chicken Bowl",
      category: "refreshing",
      description: "Grilled chicken tossed with orange slices, lime, and fresh herbs.",
      imageUrl: "https://source.unsplash.com/featured/?grilledchicken,citrus"
    },
    { 
      name: "Tropical Mango Breeze Smoothie",
      category: "refreshing",
      description: "Bright mango blended with lime and coconut water for instant beach vibes.",
      imageUrl: "https://source.unsplash.com/featured/?mango,smoothie,tropical"
    },

    // --- High-Protein Meals ---
    { 
      name: "Crispy Ginger Tofu Crunch Bowl",
      category: "protein",
      description: "Golden pan-seared tofu with a sticky ginger glaze and crunchy veggies.",
      imageUrl: "https://source.unsplash.com/featured/?tofu,bowl,asian"
    },
    { 
      name: "Savory Chicken Power Prep",
      category: "protein",
      description: "Juicy roasted chicken paired with seasoned veggies and fluffy grains.",
      imageUrl: "https://source.unsplash.com/featured/?mealprep,chicken,healthy"
    },
    { 
      name: "Smoky Black Bean Fiesta Wrap",
      category: "protein",
      description: "A warm wrap stuffed with smoky black beans, sweet corn, and roasted peppers.",
      imageUrl: "https://source.unsplash.com/featured/?wrap,blackbean,mexican"
    }
  ];

  await prisma.CuratedMeal.createMany({ data: curatedMeals });
  console.log("Seeded curated meals!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
