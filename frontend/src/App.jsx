import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Discover from './pages/Discover';
import Fridge from './pages/Fridge';
import Insights from './pages/insights';
import Profile from './pages/Profile';
import Login from './pages/login';   
import Signup from './pages/signup'; 
import MealLogger from './pages/MealLogger';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/meal-logger" element={<MealLogger />} />
        <Route path="/meal-logger/:id" element={<MealLogger />} />
      </Routes>
    </Router>
  );
}

export default App;