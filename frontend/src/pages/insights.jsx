import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function Insights() {
  const [calendarData, setCalendarData] = useState([]);
  const [patternsData, setPatternsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("week"); // week or month

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  


  // Mood emoji map
  const moodEmoji = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    stressed: "😣",
    energetic: "⚡",
  };

  // Background colors per mood
  const moodColors = {
    happy: "bg-green-200",
    neutral: "bg-gray-200",
    sad: "bg-blue-200",
    stressed: "bg-red-200",
    energetic: "bg-yellow-200",
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));

  }, [navigate]);
  // Fetch data whenever view changes
  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      setError("");

      try {
        const [calendarRes, patternsRes] = await Promise.all([
          fetch(`/api/insights/mood-calendar?view=${view}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/insights/patterns`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!calendarRes.ok || !patternsRes.ok) {
          throw new Error("API error");
        }

        const cal = await calendarRes.json();
        const patt = await patternsRes.json();

        setCalendarData(cal.calendarData);
        setPatternsData(
          patt.sort((a, b) => b.count - a.count) 
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [view, token]);

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
          Insights & Analytics
        </h1>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <TrendingUp className="w-20 h-20 mx-auto text-gray-300 mb-6 animate-spin" />
            <h2 className="text-xl text-gray-700">Loading insights...</h2>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* View Toggle */}
            <div className="flex justify-end mb-6">
              <div className="flex gap-2 bg-white shadow rounded-full px-4 py-2">
                {["week", "month"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition 
                      ${
                        view === v
                          ? "bg-gray-800 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {v === "week" ? "Week View" : "Month View"}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Calendar Heatmap */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Mood Calendar
              </h2>

              <div className="grid grid-cols-7 gap-3">
                {calendarData.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl shadow-sm text-center hover:scale-105 transition cursor-pointer ${
                      moodColors[item.mood] || "bg-gray-100"
                    }`}
                  >
                    <p className="text-sm text-gray-700 font-semibold">
                      {new Date(item.date).getDate()}
                    </p>
                    <p className="text-2xl">{moodEmoji[item.mood] || "🙂"}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.mealCount} meals
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Patterns Section */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Food-Mood Patterns
              </h2>

              {patternsData.length === 0 ? (
                <p className="text-gray-600">No patterns detected yet.</p>
              ) : (
                <ul className="space-y-4">
                  {patternsData.map((p, index) => (
                    <li
                      key={index}
                      className="p-4 rounded-xl bg-gray-50 shadow-sm flex justify-between items-center"
                    >
                      <span className="text-lg font-medium text-gray-800">
                        {p.food}
                      </span>
                      <span className="text-xl">
                        →
                        <span className="ml-2">
                          {moodEmoji[p.mood] || "🙂"} {p.mood}
                        </span>
                      </span>
                      <span className="text-sm text-gray-500">
                        {p.count} times
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Insights;
