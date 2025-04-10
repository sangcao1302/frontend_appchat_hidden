importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

console.log('=== Service Worker Initialized ===');

let firebaseApp = null;
let messaging = null;

// Get environment variables from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        console.log('📥 Service worker received Firebase config');
        try {
            if (!firebaseApp) {
                firebaseApp = firebase.initializeApp(event.data.config);
                console.log('✅ Firebase initialized in service worker');

                messaging = firebase.messaging();
                console.log('✅ Firebase Messaging initialized');

                // Set up background message handler
                messaging.onBackgroundMessage((payload) => {
                    console.log('=== Background Message Received ===');
                    console.log('📨 Message payload:', payload);

                    const notificationTitle = payload.notification.title;
                    const notificationOptions = {
                        body: payload.notification.body,
                        icon: '/logo192.png',
                        badge: '/logo192.png',
                        data: payload.data
                    };

                    console.log('📢 Showing notification:', notificationTitle);
                    return self.registration.showNotification(notificationTitle, notificationOptions);
                });
            }
        } catch (error) {
            console.error('❌ Error initializing Firebase in service worker:', error);
        }
    }
});

// Handle push events (for standard web push notifications)
self.addEventListener('push', (event) => {
    console.log('=== Push Event Received ===');
    if (event.data) {
        const data = event.data.json();
        console.log('📨 Push data:', data);

        const notificationTitle = data.notification.title;
        const notificationOptions = {
            body: data.notification.body,
            icon: '/logo192.png',
            badge: '/logo192.png',
            data: data.data
        };

        console.log('📢 Showing notification:', notificationTitle);
        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    }
}); 