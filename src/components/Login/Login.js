// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import { GoogleLogin } from '@react-oauth/google';
// import jwtDecode from 'jwt-decode';
// import "./Login.css";

// const socket = io('${baseURL}'); // Initialize the socket connection

// const provinces = [
//     "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Kạn", "Bắc Giang", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
// ];

// const Login = ({ onLogin }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [gender, setGender] = useState('');
//     const [age, setAge] = useState('');
//     const [location, setLocation] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [googleUser, setGoogleUser] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Check if a token already exists in local storage
//         const token = localStorage.getItem('token');
//         if (token) {
//             // If a token exists, emit login event and navigate to chat
//             const userId = localStorage.getItem('userId'); // Assume you stored userId in local storage as well
//             socket.emit('login', userId);
//             navigate('/chat', { state: { userId } }); // Redirect to chat
//         }
//     }, [navigate]);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setErrorMessage(''); // Reset error message

//         try {
//             const response = await axios.post('http://localhost:5000/login', { email, password });
//             alert(response.data.message);
//             onLogin(response.data.token); // Pass token to parent component
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('userId', response.data.userId); // Store userId

//             // Emit login event with userId
//             socket.emit('login', response.data.userId);

//             navigate('/chat', { state: { userId: response.data.userId } }); // Navigate to chat after login
//         } catch (error) {
//             // Display error message
//             setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
//         }
//     };

//     const handleGoogleLoginSuccess = async (response) => {
//         const id_token = response.credential;

//         // Decode the id_token to get user information
//         // const decodedToken = jwtDecode(id_token);
//         // console.log("Decoded Token:", decodedToken);

//         try {
//             const res = await axios.post('http://localhost:5000/api/auth/google', { id_token });

//             alert(res.data.message);
//             setGoogleUser(res.data.user); // Store Google user data

//             // Check if additional information is needed
//             if (!res.data.user.gender || !res.data.user.age || !res.data.user.location) {
//                 setGoogleUser(res.data.user); // Store Google user data
//             } else {
//                 // If additional information is not needed, log in the user
//                 onLogin(res.data.token); // Pass token to parent component
//                 localStorage.setItem('token', res.data.token);
//                 localStorage.setItem('userId', res.data.userId); // Store userId

//                 // Emit login event with userId
//                 socket.emit('login', res.data.userId);

//                 navigate('/chat', { state: { userId: res.data.userId } }); // Navigate to chat after login
//             }
//         } catch (error) {
//             // Display error message
//             setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
//         }
//     };

//     const handleGoogleLoginFailure = (error) => {
//         setErrorMessage('Google login failed. Please try again.');
//     };

//     const handleAdditionalInfoSubmit = async (e) => {
//         e.preventDefault();
//         setErrorMessage(''); // Reset error message

//         try {
//             const response = await axios.post('http://localhost:5000/api/auth/google/additional-info', {
//                 userId: googleUser._id,
//                 gender,
//                 age,
//                 location,
//             });
//             alert(response.data.message);
//             onLogin(response.data.token); // Pass token to parent component
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('userId', response.data.userId); // Store userId

//             // Emit login event with userId
//             socket.emit('login', response.data.userId);

//             navigate('/chat', { state: { userId: response.data.userId } }); // Navigate to chat after login
//         } catch (error) {
//             // Display error message
//             setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
//         }
//     };

//     // Clean up on component unmount
//     useEffect(() => {
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     return (
//         <div className="login-container">
//             {!googleUser ? (
//                 <form className="login-form w-100" onSubmit={handleLogin}>
//                     <div className="form-group">
//                         <h2>Login Form</h2>
//                         {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//                         <input
//                             type="email"
//                             className="form-control"
//                             aria-label="Email"
//                             placeholder="Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                         <input
//                             type="password"
//                             className="form-control mt-3"
//                             aria-label="Password"
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <button type="submit" className="btn btn-primary mt-3">Login</button>
//                         <div className="text-center mt-3">
//                             <p>
//                                 Forgot password? <a href="#">Click Here</a><br />
//                                 Don’t have an account? <a href="#">Sign up</a>
//                             </p>
//                         </div>
//                     </div>
//                 </form>
//             ) : (
//                 <form className="additional-info-form w-100" onSubmit={handleAdditionalInfoSubmit}>
//                     <div className="form-group">
//                         <h2>Additional Information</h2>
//                         {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//                         <select
//                             className="form-control"
//                             aria-label="Gender"
//                             value={gender}
//                             onChange={(e) => setGender(e.target.value)}
//                             required
//                         >
//                             <option value="" disabled>Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                         </select>
//                         <input
//                             type="number"
//                             className="form-control mt-3"
//                             aria-label="Age"
//                             placeholder="Age"
//                             value={age}
//                             onChange={(e) => setAge(e.target.value)}
//                             required
//                         />
//                         <select
//                             className="form-control mt-3"
//                             aria-label="Location"
//                             value={location}
//                             onChange={(e) => setLocation(e.target.value)}
//                             required
//                         >
//                             <option value="" disabled>Select Location</option>
//                             {provinces.map((province) => (
//                                 <option key={province} value={province}>{province}</option>
//                             ))}
//                         </select>
//                         <button type="submit" className="btn btn-primary mt-3">Submit</button>
//                     </div>
//                 </form>
//             )}
//             <div className="google-login">
//                 <GoogleLogin
//                     onSuccess={handleGoogleLoginSuccess}
//                     onError={handleGoogleLoginFailure}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Login;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
// import getLocation from '../../utils/getLocation';
import "./Login.css";
const baseURL = process.env.REACT_APP_BASE_URL;

const socket = io(baseURL); // Initialize the socket connection



const Login = ({ onLogin }) => {
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [location, setLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [googleUser, setGoogleUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a token already exists in local storage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            // If a token exists, emit login event and navigate to chat
            socket.emit('login', userId);
            navigate('/chat', { state: { userId } }); // Redirect to chat
        }
    }, [navigate]);

    const handleGoogleLoginSuccess = async (response) => {
        const id_token = response.credential;
        try {
            const res = await axios.post(`${baseURL}/api/auth/google`, { id_token });
            if (res.data.user.Ban===true) {
                setErrorMessage('Tài khoản của bạn đã bị khóa');
                return;
            }
            // alert(res.data.message);
            setGoogleUser(res.data.user); // Store Google user data

            // Check if additional information is needed
            if (!res.data.user.gender || !res.data.user.age || !res.data.user.location) {
                setGoogleUser(res.data.user); // Store Google user data
            } else {
                // If additional information is not needed, log in the user
                onLogin(res.data.token); // Pass token to parent component
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId); // Store userId

                // Emit login event with userId
                socket.emit('login', res.data.userId);

                navigate('/chat', { state: { userId: res.data.userId } }); // Navigate to chat after login
              
            }
        } catch (error) {
            // Display error message
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
        
    };

    const handleGoogleLoginFailure = (error) => {
        setErrorMessage('Google login failed. Please try again.');
    };

    const handleAdditionalInfoSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            const response = await axios.post(`${baseURL}/api/auth/google/additional-info`, {
                userId: googleUser._id,
                gender,
                age,
            });
            // alert(response.data.message);
            onLogin(response.data.token); // Pass token to parent component
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); // Store userId

            // Emit login event with userId
            socket.emit('login', response.data.userId);

            navigate('/policy'); // Navigate to chat after login
        } catch (error) {
            // Display error message
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="login-container">
            {googleUser ? (
                <form className="additional-info-form w-100" onSubmit={handleAdditionalInfoSubmit}>
                    <div className="form-group">
                        <h2>Additional Information</h2>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <select
                            className="form-control"
                            aria-label="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="LGBT nam">LGBT Nam</option>
                            <option value="LGBT nữ">LGBT nữ</option>
                        </select>
                        <input
                            type="number"
                            className="form-control mt-3"
                            aria-label="Age"
                            placeholder="Tuổi"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                        />
                        {/* <select
                            className="form-control mt-3"
                            aria-label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select Location</option>
                            {provinces.map((province) => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select> */}
                        <button type="submit" className="btn btn-primary mt-3">Submit</button>
                    </div>
                </form>
            ) : (
                <div className="google-login mx-auto">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginFailure}
                        render={(renderProps) => (
                            <button className="google-login-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" width="20" height="20" />
                                Sign in with Google
                            </button>
                        )}
                    />
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                </div>
            )}
        </div>
    );
};

export default Login;