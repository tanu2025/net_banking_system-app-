import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [receiverEmail, setReceiverEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        try {
            const userRes = await axios.get('http://localhost:3007/api/users/profile', config);
            setUser(userRes.data);
            const transactionRes = await axios.get('http://localhost:3007/api/transactions/last-five', config);
            setTransactions(transactionRes.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch data');
            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                navigate('/login');
            }
        }
    };

    const handleSendMoney = async (e) => {
        e.preventDefault();
        if (!receiverEmail || !amount) {
            toast.error('Please fill all fields');
            return;
        }
        if (parseFloat(amount) <= 0) {
            toast.error('Amount must be positive');
            return;
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        try {
            const { data } = await axios.post('http://localhost:3007/api/transactions/send', { receiverEmail, amount: parseFloat(amount) }, config);
            toast.success(data.message);
            setUser(prevUser => ({ ...prevUser, balance: data.newBalance }));
            setReceiverEmail('');
            setAmount('');
            fetchData(); // Refresh transactions
        } catch (error) {
            toast.error(error.response?.data?.message || 'Transaction failed');
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };
        try {
            const { data } = await axios.put('http://localhost:3007/api/users/profile', { name: user.name, email: user.email }, config);
            localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, name: data.name, email: data.email }));
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Profile update failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
        toast.success('Logged out successfully!');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <button onClick={toggleSidebar} className="toggle-btn">
                    {isSidebarOpen ? '❮' : '❯'}
                </button>
                <div className="sidebar-content">
                    <Collapsible trigger="Last 5 Transactions">
                        <ul className="transaction-list">
                            {transactions.length > 0 ? (
                                transactions.map((t, index) => (
                                    <li key={index} className={t.type}>
                                        {t.type === 'debit' ? (
                                            <span>Debited ₹{t.amount} to {t.contact}</span>
                                        ) : (
                                            <span>Credited ₹{t.amount} from {t.contact}</span>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li>No transactions found.</li>
                            )}
                        </ul>
                    </Collapsible>
                </div>
            </div>
            <div className="main-content">
                <div className="header">
                    <h1>Welcome, {user.name}!</h1>
                    <div className="balance-info">
                        <p>Current Balance:</p>
                        <h3>₹{user.balance?.toFixed(2) || '0.00'}</h3>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>

                <div className="dashboard-sections">
                    <div className="section send-money-form">
                        <h2>Send Money</h2>
                        <form onSubmit={handleSendMoney}>
                            <input type="email" placeholder="Receiver's Email" value={receiverEmail} onChange={(e) => setReceiverEmail(e.target.value)} required />
                            <input type="number" placeholder="Amount (INR)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                            <button type="submit">Send</button>
                        </form>
                    </div>

                    <div className="section profile-update-form">
                        <h2>Update Profile</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <input type="text" placeholder="Name" value={user.name || ''} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                            <input type="email" placeholder="Email" value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                            <button type="submit">Update</button>
                        </form>
                    </div>
                </div>

                <div className="chatbot-container">
                    <Chatbot />
                </div>
            </div>
        </div>
    );
};


const Chatbot = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleChatbotSubmit = (e) => {
        e.preventDefault();
        if (!input) return;
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        // Simple bot logic based on keywords
        let botMessage;
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('balance')) {
            botMessage = { text: 'You can see your current balance at the top of the dashboard.', sender: 'bot' };
        } else if (lowerInput.includes('send money')) {
            botMessage = { text: 'Use the "Send Money" form to transfer funds to another user.', sender: 'bot' };
        } else if (lowerInput.includes('update profile')) {
            botMessage = { text: 'You can update your name and email in the "Update Profile" section.', sender: 'bot' };
        } else if (lowerInput.includes('hello')) {
            botMessage = { text: 'Hello! How can I help you today?', sender: 'bot' };
        } else {
            botMessage = { text: "I'm a simple bot. I can help with general questions about the dashboard features.", sender: 'bot' };
        }

        setTimeout(() => {
            setMessages(prevMessages => [...prevMessages, botMessage]);
        }, 500);

        setInput('');
    };

    return (
        <div className="chatbot-box">
            <h3>Chatbot</h3>
            <div className="chat-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleChatbotSubmit} className="chat-input-form">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Dashboard;