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
import AutoModal from '../Popup/AutoModal';
const baseURL = process.env.REACT_APP_BASE_URL;

// Set the server URL from environment variables for deployment flexibility
const socket = io(baseURL);

const Chat = () => {
 
    // const { state } = useLocation();
    // const { userId } = state;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [matchedUser, setMatchedUser] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isTyping, setIsTyping] = useState(false);  // Track if other user is typing
    const [isSending, setIsSending] = useState(false);
    const [checked, setChecked] = useState(() => {
        return localStorage.getItem('darkMode') === "true"; // Load from storage
    });    
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const userId = localStorage.getItem('userId');
    const policyAccepted = localStorage.getItem('policyAccepted') === 'true';
    const darkMode = localStorage.getItem('darkMode')
    useEffect(() => {
        if (!policyAccepted) {
            navigate('/policy', { replace: true });
        } else if (!userId) {
            navigate('/login', { replace: true });
        }
    }, [navigate, policyAccepted, userId]);
    
    let receiverId=""
    useEffect(() => {
        localStorage.setItem('darkMode', checked); // Store the state
    }, [checked]);
    const user = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/user/${userId}`);
            if (response.status === 200) {
                console.log(response.data)
                return response.data
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
   
    useEffect(() => {
        const fetchMessages = async () => {
          const id=await user()
          if(id.matchedUser !== null){
            receiverId=id.matchedUser
            try {

                const response = await axios.get(`${baseURL}/api/messages/${userId}/${receiverId}`);

                if (response.status === 200) {
                    setMessages(response.data.map(msg => ({
                        ...msg,
                        isSelf: msg.senderId === userId,
                    })));
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }
        }
        

        fetchMessages()

        // Initial connection and message fetching
        socket.emit('login', userId);
       
        
        // Socket event listeners
        socket.on('message', (message) => {
            setMessages(prev => [...prev, { ...message, isSelf: message.senderId === userId }]);
        });
        socket.on('matchedUser', (user) => {
            setMatchedUser(user);
            setWaiting(false);
        });
        // fetchMessages();
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
            socket.off('forceLogout');
        };
    }, [userId]);
    useEffect(() => {
        // Listen for force logout from the server
        socket.on("forceLogout", () => {
            alert("❌ You have been logged out due to inactivity or disconnection.");
            handleLogout();
        });

        return () => {
            socket.off("forceLogout");
        };
    }, []);


    useEffect(() => {
        // Scroll to the bottom of the messages container whenever new messages are added
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const startChat = useCallback(async () => {
        resetChat();
        try {
            const locationData = await getLocation();
            if (locationData) {
                const region = getRegion(locationData.state_prov);
                await axios.post(`${baseURL}/api/auth/update-location`, { userId, ip: locationData.ip });
                await axios.post(`${baseURL}/api/auth/update-place`, { userId, location: locationData.state_prov });
                // console.log(locationData.state_prov, region);
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
// const setMatchedUserId=async(id)=>{
//     try {
//         await axios.post(`${baseURL}/api/auth/google/additional-info`, {
//             matchedUser: id
//         });

//     } catch (error) {
//         // Display error message
//         console.error('Error match user id:', error);
//     }
// }
const sendMessage = async (e) => {
    e.preventDefault();
    if (input && matchedUser && !isSending) {
        setIsSending(true);
        const message = { text: input, receiverId: matchedUser.id, senderId: userId };
        console.log(matchedUser.id)
    //   if(matchedUser.id!==matchedUser.id){
    //     console.log(matchedUser.id)
    //     setMatchedUserId(message.receiverId)
    // }
        try {
            const response = await axios.post(`${baseURL}/api/messages`, message);
            if (response.status === 201 || response.status === 200) { // Allow both 200 and 201
                socket.emit('message', message);
                setMessages(prev => [...prev, { ...message, isSelf: true }]);
                setInput('');
                socket.emit('stopTyping', { receiverId: matchedUser.id }); // Stop typing when message is sent
            } else {
                console.error('Unexpected response status:', response.status);
                alert(`Message failed to send. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
            alert(`Message failed to send. Error: ${error.response ? error.response.data.message : error.message}`);
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
        // localStorage.removeItem("receiverId")
        window.location.reload()
    };

    // const toggleDropdown = () => setShowDropdown(prev => !prev);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId")
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
    const handleBan = async () => {
        breakChat();
        try {
            await axios.post(`${baseURL}/api/user/ban/${matchedUser?.id}`);

            const response=await axios.get(`${baseURL}/api/user/${matchedUser?.id}`) 
            if(response.data.Ban === true){
                socket.emit("banUser",matchedUser?.id);
            }
            window.location.reload()
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };
    const handleDarkMode = () => {
        setChecked(prev => !prev); // Toggle dark mode state
    };
    return (
        
        <div className="chat-container">
            <AutoModal />

            <div className="header px-2 py-1">
                <div className="row align-items-center g-0">
                    <div className=" col-md-6 col-sm-10 w-50 d-flex ">
                        <span>Kết đôi - Hẹn Hò</span>
                    </div>
                    
                    <div className="col-md-6 col-sm-2 w-50 d-flex justify-content-end align-items-center">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={checked} onChange={handleDarkMode} />
                        </div>
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
            <div className={checked ? 'modeDark' : 'messages' }>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isSelf ? 'self' : 'other'}`}>
                        {msg.text}
                    </div>
                ))}
                {waiting && <p className={checked ? 'modeDarkWaiting' : ''}>Waiting for a match...</p>}
                {isTyping && <p className="typing-indicator fst-italic text-primary typing">Typing ....</p>} {/* Typing indicator */}
                <div ref={messagesEndRef} />
            </div>
            {matchedUser ? (
                <form className={checked ? 'modeDarkFormInput' : 'input-container' } onSubmit={sendMessage}>
                    <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <FaRegSmile />
                    </button>
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    <input
                        className={checked ? "modeDarkInput" : 'input-message' }
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onBlur={handleBlur} // Stop typing when input loses focus
                        placeholder="Type a message..."
                        
                    />
                    <button type="submit" disabled={isSending} className={checked ? "buttonSendMessage" : "" }>
                        <FaPaperPlane />
                    </button>
                    {/* <button type="button" className="dropdown-toggle" onClick={toggleDropdown}>
                        <FaEllipsisV />
                    </button> 
                     {showDropdown && (
                        <ul className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                            <li className='py-3 '>
                                <button className="break-chat-button text-center " onClick={handleBan}>
                                    <span className='text-danger'>Report <FaTimes className='text-danger' /></span>                      
                                </button>
                                <hr className='border border-danger border-1 bg-dark w-100'></hr>
                                <button className="break-chat-button text-center" onClick={breakChat}>
                                    <span className='text-danger'>End Chat <FaTimes className='text-danger' /></span>
                                </button>
                            </li>
                           <li>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#endChatModal">
                                    Endchat
                                </button>
                           </li>
                        </ul>
                    )}
                    <div class="modal fade" id="endChatModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                               
                                <div class="modal-body text-center fw-bold">
                                    Are you sure you want to end the chat?
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary fw-bold" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-danger fw-bold" onClick={breakChat}>Endchat</button>
                                </div>
                            </div>
                        </div>
                    </div>  */}

                     <div className="dropdown-center dropup">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaEllipsisV />
                        </button>
                        <ul className="dropdown-menu px-2">
                            <li >
                                <button type="button" className="btn btn-danger border-0 py-2 " id='reportUser'  data-bs-toggle="modal" data-bs-target="#report">
                                    Report
                                </button>
                            </li>
                            <li className='mt-2'>
                                <button type="button" className="btn btn-danger border-0 " id='endchatUser' data-bs-toggle="modal" data-bs-target="#endchat">
                                    End Chat
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="modal fade" id="endchat" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                               
                                <div className="modal-body text-center">
                                   Are you sure you want to end the chat?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary fw-bold" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-danger fw-bold"  onClick={breakChat}>Endchat</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="report" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body text-center">
                                    Are you sure you want report this user?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary fw-bold" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-danger fw-bold" onClick={handleBan}>Report</button>
                                </div>
                            </div>
                        </div>
                    </div> 


                </form>
            ) : (
                <button onClick={startChat} className="w-100 start-chat-button py-2">Start Chat</button>
            )}
        </div>
    );
};

export default Chat;