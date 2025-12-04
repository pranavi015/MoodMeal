import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/api";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack", "dessert"];

export default function MealLogger() {
    const navigate = useNavigate();

    const [mealType, setMealType] = useState("breakfast");
    const [foods, setFoods] = useState("");
    const [moodAfter, setMoodAfter] = useState("😀");
    const [notes, setNotes] = useState("");
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    // Upload to Cloudinary
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
            let photoUrl = "";

            // Upload photo to Cloudinary if selected
            if (photo) {
                photoUrl = await uploadToCloudinary(photo);
            }

            const payload = {
                mealType,
                foods: foods.split(",").map(f => f.trim()).join(", "), // MySQL safe string format
                moodAfter,
                notes,
                photo: photoUrl, // Cloudinary URL
            };

            await api.post("api/meals", payload);
            navigate("/meals");

        } catch (error) {
            console.error("Error creating meal:", error);
            alert("Failed to save meal.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout>
            <div className="p-8 max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
                    Log a New Meal
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
                            placeholder="e.g. rice, chicken, salad"
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
                            <option>happy😊</option>
                            <option>light😃</option>
                            <option>satisfied😌</option>
                            <option>heavy😐</option>
                            <option>bloated😓</option>
                            <option>unsure🤔</option>

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
                            placeholder="How did this meal make you feel?"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="font-semibold">Meal Photo (JPG/PNG)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            className="w-full border rounded px-4 py-2 mt-2"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Meal"}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
