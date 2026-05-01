import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/api";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack", "dessert"];

export default function MealLogger() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get id from URL
  const isEditMode = Boolean(id);

  const [mealType, setMealType] = useState("breakfast");
  const [foods, setFoods] = useState("");
  const [moodAfter, setMoodAfter] = useState("unsure");
  const [moodBefore] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch meal if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchMeal = async () => {
      try {
        const res = await api.get(`/api/meals/${id}`);
        const meal = res.data;

        setMealType(meal.mealType || "breakfast");
        setFoods(meal.foods || "");
        setMoodAfter(meal.moodAfter || "unsure");
        setNotes(meal.notes || "");
        setExistingPhoto(meal.photo || "");
      } catch (error) {
        console.error("Error fetching meal:", error);
        alert("Failed to load meal.");
        navigate("/meals");
      }
    };

    fetchMeal();
  }, [id, isEditMode, navigate]);

  // Cloudinary upload
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      let photoUrl = existingPhoto;
  
      if (photo) {
        photoUrl = await uploadToCloudinary(photo);
      }
  
      const payload = {
        mealType,
        foods,
        photo: photoUrl,
        moodBefore,
        moodAfter,
        notes
      };
  
      if (isEditMode) {
        await api.put(`/api/meals/${id}`, payload);
      } else {
        await api.post("/api/meals", payload);
      }
  
      navigate("/meals");
    } catch (error) {
        console.error("Save error:", error.response?.data || error);
        alert(error.response?.data?.error || "Failed to save meal.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
          {isEditMode ? "Edit Meal" : "Log a New Meal"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-lg">

          {/* Meal Type */}
          <div>
            <label className="font-semibold">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full border rounded px-4 py-2 mt-2"
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Foods */}
          <div>
            <label className="font-semibold">Foods (comma separated)</label>
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              className="w-full border rounded px-4 py-2 mt-2"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="font-semibold">Mood After Eating</label>
            <select
              value={moodAfter}
              onChange={(e) => setMoodAfter(e.target.value)}
              className="w-full border rounded px-4 py-2 mt-2"
            >
              <option value="happy">happy</option>
              <option value="light">light</option>
              <option value="satisfied">satisfied</option>
              <option value="heavy">heavy</option>
              <option value="bloated">bloated</option>
              <option value="unsure">unsure</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded px-4 py-2 mt-2"
            />
          </div>

          {/* Existing Photo Preview */}
          {existingPhoto && (
            <img
              src={existingPhoto}
              alt="Meal"
              className="w-full h-44 object-cover rounded-lg"
            />
          )}

          {/* Upload New Photo */}
          <div>
            <label className="font-semibold">Change Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full border rounded px-4 py-2 mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Meal"
              : "Save Meal"}
          </button>

        </form>
      </div>
    </Layout>
  );
}