// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Frontpage from './pages/Frontpage';
import UserSignUp from './pages/UserSignUp';
import AdminSignUp from './pages/AdminSignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/" element={<Frontpage />} />
      </Routes>
    </Router>
  );
}

export default App;
