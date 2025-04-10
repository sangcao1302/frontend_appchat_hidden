import React, { useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaRegSmile, FaTimes, FaEllipsisV } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './Chat.css';
import getLocation from '../../utils/updateLocation';
import { getRegion } from '../../utils/regions';
import AutoModal from '../Popup/AutoModal';
import { requestNotificationPermission } from '../../firebase';

const baseURL = process.env.REACT_APP_BASE_URL;
const socket = io(baseURL);

const Chat = () => {
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

    let receiverId = ""
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
            const id = await user()
            if (id.matchedUser !== null) {
                receiverId = id.matchedUser
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

    useEffect(() => {
        // Request notification permission and update FCM token
        const setupNotifications = async () => {
            try {
                const fcmToken = await requestNotificationPermission();
                if (fcmToken) {
                    // Update FCM token in backend
                    await axios.post(`${baseURL}/api/notifications/update-token`, {
                        userId: userId,
                        fcmToken: fcmToken
                    });
                }
            } catch (error) {
                console.error('Error setting up notifications:', error);
            }
        };

        setupNotifications();
    }, [userId]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input && matchedUser && !isSending) {
            setIsSending(true);

            const message = { text: input, receiverId: matchedUser.id, senderId: userId };
            try {
                const response = await axios.post(`${baseURL}/api/messages`, {
                    senderId: userId,
                    receiverId: matchedUser.id,
                    text: input,
                });

                if (response.status === 200 || response.status === 201) {
                    console.log('Message sent:', response.data);
                    socket.emit('message', message);
                    setMessages(prev => [...prev, { ...message, isSelf: true }]);
                    setInput('');

                    // Send notification to the receiver
                    try {
                        await axios.post(`${baseURL}/api/notifications/send`, {
                            userId: matchedUser.id,
                            title: 'New Message',
                            body: input,
                            data: {
                                type: 'message',
                                senderId: userId,
                                senderName: matchedUser.username,
                                messageId: response.data._id
                            }
                        });
                    } catch (error) {
                        console.error('Error sending notification:', error);
                    }
                }
            } catch (error) {
                console.error('Error sending message to the server:', error.response ? error.response.data : error.message);
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

            const response = await axios.get(`${baseURL}/api/user/${matchedUser?.id}`)
            if (response.data.Ban === true) {
                socket.emit("banUser", matchedUser?.id);
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
            <div className={checked ? 'modeDark' : 'messages'}>
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
                <form className={checked ? 'modeDarkFormInput' : 'input-container'} onSubmit={sendMessage}>
                    <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <FaRegSmile />
                    </button>
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                    <input
                        className={checked ? "modeDarkInput" : 'input-message'}
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onBlur={handleBlur} // Stop typing when input loses focus
                        placeholder="Type a message..."

                    />
                    <button type="submit" disabled={isSending} className={checked ? "buttonSendMessage" : ""}>
                        <FaPaperPlane />
                    </button>
                    <div className="dropdown-center dropup">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaEllipsisV />
                        </button>
                        <ul className="dropdown-menu px-2">
                            <li >
                                <button type="button" className="btn btn-danger border-0 py-2 " id='reportUser' data-bs-toggle="modal" data-bs-target="#report">
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
                                    <button type="button" className="btn btn-danger fw-bold" onClick={breakChat}>Endchat</button>
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