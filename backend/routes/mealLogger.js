const res = await fetch("http://localhost:3000/api/meals", { 
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData, 
});
