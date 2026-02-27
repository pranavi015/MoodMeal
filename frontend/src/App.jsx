import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Meals from './pages/meals';
import Insights from './pages/insights';
import Swaps from './pages/swaps';
import Profile from './pages/Profile';
import Login from './pages/login';   
import Signup from './pages/signup'; 
import MealLogger from './pages/MealLogger';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/swaps" element={<Swaps />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/meal-logger" element={<MealLogger />} />
        <Route path="/meal-logger/:id" element={<MealLogger />} />

      </Routes>
    </Router>
  );
}

export default App;