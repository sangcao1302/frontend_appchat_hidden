// import React, { useEffect, useState, useCallback } from 'react';
// import io from 'socket.io-client';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaPaperPlane, FaRegSmile, FaTimes, FaEllipsisV } from 'react-icons/fa';
// import EmojiPicker from 'emoji-picker-react';
// import axios from 'axios'; // Import Axios
// import '../Chat.css';

// const socket = io('http://localhost:5000');

// const Chat = () => {
//   const { state } = useLocation();
//   const { userId } = state; // Retrieve userId from the state
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [matchedUser, setMatchedUser] = useState(null);
//   const [waiting, setWaiting] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown visibility
//   const navigate=useNavigate()
//   useEffect(() => {
//     // Emit login event for the user
//     console.log(`Logging in user: ${userId}`);
//     socket.emit('login', userId);

//     // Fetch messages from the server when the chat starts
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/messages/${userId}`);
//         if (response.ok) {
//           const data = await response.json();
//           console.log('Fetched messages:', data); // Log fetched messages
//           setMessages(data.map(msg => ({
//             ...msg,
//             isSelf: msg.senderId === userId, // Flag for sent messages
//           })));
//         } else {
//           console.error('Failed to fetch messages');
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages(); // Fetch messages on mount

//     // Socket event listeners
//     socket.on('message', (message) => {
//       console.log('Message received:', message); // Log received messages
//       setMessages(prev => [...prev, { ...message, isSelf: message.from === userId }]);
//     });

//     socket.on('matchedUser', (user) => {
//       console.log('Matched user:', user); // Log matched user
//       setMatchedUser(user);
//       setWaiting(false);
//     });

//     socket.on('waiting', () => {
//       console.log('Waiting for a match...');
//       setWaiting(true);
//     });

//     socket.on('chatEnded', () => {
//       console.log('Chat ended');
//       resetChat();
//     });

//     socket.on('reconnect', () => {
//       console.log('Reconnected to the server');
//       fetchMessages(); // Fetch messages again on reconnection
//     });

//     return () => {
//       socket.off('message');
//       socket.off('matchedUser');
//       socket.off('waiting');
//       socket.off('chatEnded');
//       socket.off('reconnect');
//     };
//   }, [userId]);

//   const startChat = useCallback(() => {
//     resetChat();
//     socket.emit('startChat', userId);
//   }, [userId]);

//   const resetChat = useCallback(() => {
//     setMatchedUser(null);
//     setWaiting(false);
//     setShowDropdown(false); // Close dropdown when resetting
//   }, []);

//   const [isSending, setIsSending] = useState(false);

// const sendMessage = async (e) => {
//   e.preventDefault();
//   if (input && matchedUser && !isSending) {
//     setIsSending(true); // Disable sending

//     const message = { text: input, receiverId: matchedUser.id, senderId: userId };
//     console.log(message)
//     try {
//       const response = await axios.post('http://localhost:5000/api/messages', {
//         senderId: userId,
//         receiverId: matchedUser.id,
//         text: input,
//       });

//       if (response.status === 200 || response.status === 201) {
//         console.log('Message sent:', response.data);
//         socket.emit('message', message);
//         setMessages(prev => [...prev, message]);
//         setInput('');
//       }
//     } catch (error) {
//       console.error('Error sending message to the server:', error.response ? error.response.data : error.message);
//     } finally {
//       setIsSending(false); // Re-enable sending
//     }
//   }
// };



//   const onEmojiClick = (emojiData) => {
//     setInput((prev) => prev + emojiData.emoji);
//     setShowEmojiPicker(false);
//   };

//   const breakChat = async () => {
//     // Emit endChat event and handle message deletion in the server
//     socket.emit('endChat');
//     resetChat();
//   };

//   const toggleDropdown = () => {
//     setShowDropdown((prev) => !prev); // Toggle dropdown visibility
//   };
//   const handleLogout=()=>{
//     localStorage.clear("token")
//     navigate('/login')
//   }
//   return (
//     <div className="chat-container">                         
//       <div className='header px-2 py-1'>
//         <div className='row align-items-center g-0'>
//           <div className='nameApp col-md-6'>
//             <span>Kết đôi - Hẹn Hò</span>
//           </div>
//           <div className='col-md-6 d-flex justify-content-end'>
//               <div>
//                   <button type="button" class="btn btn-tranparent text-white" data-bs-toggle="modal" data-bs-target="#exampleModal">
//                     <i class="fa fa-sign-out" aria-hidden="true"></i>
//                   </button>
//                   <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                     <div class="modal-dialog">
//                       <div class="modal-content">
//                         <div className="modal-body text-dark text-center">                      
//                           Are you sure to log out?
//                         </div>
//                         <div class="modal-footer">
//                             <button type="button" className="btn border-0  text-white bg-black" onClick={handleLogout}>End Chat</button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//               </div>
//           </div>
//         </div>
//       </div>
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.senderId === userId ? 'self' : 'other'}`}>
//             {msg.text}
//           </div>
//         ))}
//         {waiting && <p>Waiting for a match...</p>}
//       </div>
//       {matchedUser ? (
//         <form className="input-container" onSubmit={sendMessage}>
//           <button
//             type="button"
//             className="emoji-button"
//             onClick={() => setShowEmojiPicker((prev) => !prev)}
//           >
//             <FaRegSmile />
//           </button>
//           {showEmojiPicker && (
//             <div className="emoji-picker">
//               <EmojiPicker onEmojiClick={onEmojiClick} />
//             </div>
//           )}
//           <input
//             className="input-message"
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type a message..."
//             required
//           />
//           <button type="submit">
//             <FaPaperPlane />
//           </button>
//           <button
//             type="button"
//             className="dropdown-toggle"
//             onClick={toggleDropdown}
//           >
//             <FaEllipsisV />
//           </button>
//           {showDropdown && (
//             <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
//               <li>
//                 <button className="break-chat-button text-center btn bg-dark" onClick={breakChat}>
//                   <span className='text-danger'>End Chat</span>
//                   <FaTimes className='text-danger' />
//                 </button>
//               </li>
              
//             </ul>
//           )}
//         </form>
//       ) : (
//         <button onClick={startChat} className='w-100 break-chat-button'>Start Chat</button>
//       )}
      
//     </div>
//   );
// };

// export default Chat;


import React, { useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaRegSmile, FaTimes, FaEllipsisV } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './Chat.css';
import getLocation from '../../utils/updateLocation';
import { getRegion } from '../../utils/regions'; // Import the regions data
const baseURL = process.env.REACT_APP_BASE_URL;

// Set the server URL from environment variables for deployment flexibility
const socket = io(baseURL);

const Chat = () => {
    const { state } = useLocation();
    const { userId } = state;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [matchedUser, setMatchedUser] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isTyping, setIsTyping] = useState(false);  // Track if other user is typing
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();

    // Define the typing timeout ref
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/messages/${userId}`);
                if (response.status === 200) {
                    setMessages(response.data.map(msg => ({
                        ...msg,
                        isSelf: msg.senderId === userId,
                    })));
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        // Initial connection and message fetching
        socket.emit('login', userId);
        fetchMessages();

        // Socket event listeners
        socket.on('message', (message) => {
            setMessages(prev => [...prev, { ...message, isSelf: message.senderId === userId }]);
        });
        socket.on('matchedUser', (user) => {
            setMatchedUser(user);
            setWaiting(false);
        });
        socket.on('waiting', () => setWaiting(true));
        socket.on('chatEnded', resetChat);

        // Listen for typing events from the server
        socket.on('typing', ({ userId }) => { // Updated to destructure userId
            console.log(`User ${userId} is typing...`);
            setIsTyping(true);
        });

        socket.on('stopTyping', ({ userId }) => { // Updated to destructure userId
            console.log(`User ${userId} stopped typing.`);
            setIsTyping(false);
        });

        return () => {
            socket.off('message');
            socket.off('matchedUser');
            socket.off('waiting');
            socket.off('chatEnded');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, [userId]);

    const startChat = useCallback(async () => {
        resetChat();
        try {
            const locationData = await getLocation();
            if (locationData) {
                const region = getRegion(locationData.state_prov);
                await axios.post(`${baseURL}/api/auth/update-location`, { userId, location: locationData.state_prov });
                await axios.post(`${baseURL}/api/auth/update-place`, { userId, location: locationData.state_prov });
                console.log(locationData.state_prov, region);
            }
        } catch (error) {
            console.error('Error updating location:', error);
        }

        socket.emit('startChat', userId);
    }, [userId]);

    const resetChat = useCallback(() => {
        setMatchedUser(null);
        setWaiting(false);
        setMessages([]);
        setShowDropdown(false);
        setIsTyping(false); // Clear typing indicator on reset
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input && matchedUser && !isSending) {
            setIsSending(true);
            const message = { text: input, receiverId: matchedUser.id, senderId: userId };

            try {
                const response = await axios.post(`${baseURL}/api/messages`, message);
                if (response.status === 201 || response.status === 200) { // Allow both 200 and 201
                    socket.emit('message', message);
                    setMessages(prev => [...prev, { ...message, isSelf: true }]);
                    setInput('');
                    socket.emit('stopTyping', { receiverId: matchedUser.id }); // Stop typing when message is sent
                }
            } catch (error) {
                console.error('Error sending message:', error.response ? error.response.data : error.message);
                alert('Message failed to send.');
            } finally {
                setIsSending(false);
            }
        }
    };

    const onEmojiClick = (emojiData) => {
        setInput((prev) => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const breakChat = () => {
        socket.emit('endChat');
        resetChat();
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload()
    };

    // Typing indicator handling with debounce
    const handleInputChange = (e) => {
        setInput(e.target.value);
        handleTyping(e);
    };

    // Debounced function to emit typing event
    const handleTyping = useCallback(debounce((e) => {
        if (matchedUser) { // Ensure there is a matched user
            socket.emit('typing', { receiverId: matchedUser.id });
            console.log('Emitting typing event');
            if (e.target.value.trim() === "") {
                socket.emit('stopTyping', { receiverId: matchedUser.id });
                console.log('Emitting stopTyping event');
            }
        }
    }, 500), [matchedUser]);

    const handleBlur = () => {
        if (matchedUser) { // Ensure there is a matched user
            socket.emit('stopTyping', { receiverId: matchedUser.id });
            console.log('Emitting stopTyping event');
        }
    };

    return (
        <div className="chat-container">
            <div className="header px-2 py-1">
                <div className="row align-items-center g-0">
                    <div className="nameApp col-md-6">
                        <span>Kết đôi - Hẹn Hò</span>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <button type="button" className="btn btn-transparent text-white" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i className="fa fa-sign-out" aria-hidden="true"></i>
                        </button>
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body text-dark text-center">
                                        Are you sure you want to log out?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn border-0 text-white bg-black" onClick={handleLogout}>Logout</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isSelf ? 'self' : 'other'}`}>
                        {msg.text}
                    </div>
                ))}
                {waiting && <p>Waiting for a match...</p>}
                {isTyping && <p className="typing-indicator fst-italic text-primary typing">Typing ....</p>} {/* Typing indicator */}
            </div>
            {matchedUser ? (
                <form className="input-container" onSubmit={sendMessage}>
                    <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <FaRegSmile />
                    </button>
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    <input
                        className="input-message"
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onBlur={handleBlur} // Stop typing when input loses focus
                        placeholder="Type a message..."
                        required
                    />
                    <button type="submit" disabled={isSending}>
                        <FaPaperPlane />
                    </button>
                    <button type="button" className="dropdown-toggle" onClick={toggleDropdown}>
                        <FaEllipsisV />
                    </button>
                    {showDropdown && (
                        <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                            <li>
                                <button className="break-chat-button text-center btn bg-dark" onClick={breakChat}>
                                    <span className='text-danger'>End Chat</span>
                                    <FaTimes className='text-danger' />
                                </button>
                            </li>
                        </ul>
                    )}
                </form>
            ) : (
                <button onClick={startChat} className="w-100 break-chat-button">Start Chat</button>
            )}
        </div>
    );
};

export default Chat;