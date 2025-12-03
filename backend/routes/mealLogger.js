// MealLogger.jsx fetch example
const res = await fetch("http://localhost:3000/api/meals", { 
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // if using JWT
  },
  body: formData, // FormData with meal info & optional photo
});
