// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Login from './pages/login';
// import Signup from './pages/signup';
// import Dashboard from './pages/dashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Meals from './pages/meals';
import Insights from './pages/insights';
import Swaps from './pages/swaps';
import Profile from './pages/Profile';
import Login from './pages/login';   // use your login page
import Signup from './pages/signup'; // use your signup page

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
      </Routes>
    </Router>
  );
}

export default App;

