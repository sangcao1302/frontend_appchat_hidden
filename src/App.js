import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/SignUp/Signup';
import Chat from './components/Chat/Chat';
import Policy from './components/Policy/Policy'; // Import Policy component
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute component

const App = () => {
  // Function to handle login and save token to local storage
  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Save token in local storage
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/policy" element={<Policy/>} />

      {/* Use ProtectedRoute to protect the Chat route */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
