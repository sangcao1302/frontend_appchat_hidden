import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/SignUp/Signup';
import Chat from './components/Chat/Chat';
import Policy from './components/Policy/Policy'; // Import Policy component
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute component
import { requestNotificationPermission, onMessageListener } from './firebase';

const App = () => {
    useEffect(() => {
        // Request notification permission when app starts
        requestNotificationPermission()
            .then((token) => {
                console.log('Notification token:', token);
                // You can send this token to your backend to store it for the user
                localStorage.setItem('fcmToken', token);
            })
            .catch((err) => {
                console.log('Failed to get notification permission:', err);
            });

        // Listen for foreground messages
        onMessageListener()
            .then((payload) => {
                // Handle foreground messages
                console.log('Received foreground message:', payload);
                // You can show a custom notification here
                if (Notification.permission === 'granted') {
                    new Notification(payload.notification.title, {
                        body: payload.notification.body,
                        icon: '/logo192.png'
                    });
                }
            })
            .catch((err) => {
                console.log('Failed to receive foreground message:', err);
            });
    }, []);

    // Function to handle login and save token to local storage
    const handleLogin = (token) => {
        localStorage.setItem('token', token); // Save token in local storage
    };

    return (
        <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route path="/policy" element={<Policy />} />

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
