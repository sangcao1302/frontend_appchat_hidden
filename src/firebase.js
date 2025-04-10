import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase config object
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

console.log('=== Firebase Configuration Check ===');
console.log('1. Checking environment variables:');
console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing');
console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Present' : 'Missing');
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Present' : 'Missing');
console.log('Messaging Sender ID:', process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? 'Present' : 'Missing');
console.log('App ID:', process.env.REACT_APP_FIREBASE_APP_ID ? 'Present' : 'Missing');
console.log('VAPID Key:', process.env.REACT_APP_FIREBASE_VAPID_KEY ? 'Present' : 'Missing');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register service worker
let serviceWorkerRegistration = null;

if ('serviceWorker' in navigator) {
    console.log('2. Service Worker Support: Available');
    navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
    })
        .then(registration => {
            console.log('3. Service Worker registered successfully:', registration);
            serviceWorkerRegistration = registration;

            // Send Firebase config to service worker
            registration.active.postMessage({
                type: 'FIREBASE_CONFIG',
                config: firebaseConfig
            });
        })
        .catch(error => {
            console.error('Service Worker Registration Error:', error);
        });
} else {
    console.error('2. Service Worker Support: NOT Available');
}

export const requestNotificationPermission = async () => {
    try {
        console.log('=== Starting FCM Registration Process ===');
        console.log('1. Requesting notification permission...');
        const permission = await Notification.requestPermission();
        console.log('2. Notification permission status:', permission);

        if (permission === 'granted') {
            console.log('3. Permission granted, getting FCM token...');
            const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
            console.log('4. VAPID Key:', vapidKey ? 'Present' : 'Missing');

            if (!vapidKey) {
                throw new Error('VAPID key is missing. Please check your .env file');
            }

            if (!serviceWorkerRegistration) {
                throw new Error('Service Worker not registered');
            }

            const token = await getToken(messaging, {
                vapidKey: vapidKey,
                serviceWorkerRegistration: serviceWorkerRegistration
            });

            if (!token) {
                throw new Error('Failed to get FCM token');
            }

            console.log('5. FCM Token received:', token);
            console.log('=== FCM Registration Complete ===');
            return token;
        }
        console.log('❌ Notification permission denied');
        throw new Error('Notification permission denied');
    } catch (error) {
        console.error('❌ Error in FCM registration:', error);
        console.error('Error details:', error.message);
        throw error;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log('📨 Received foreground message:', payload);
            resolve(payload);
        });
    });

export default messaging; 