import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

ReactDOM.render(
    <GoogleOAuthProvider clientId="856169255965-cljq70k845iulkcj31mgjqpp22gma6fi.apps.googleusercontent.com">
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);