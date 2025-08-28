// import React, { useState } from 'react';
// import '../styles/Chatbot.css'; // Corrected import path

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isOpen, setIsOpen] = useState(false);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { text: input, sender: 'user' };
//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);

//     // Simple rule-based bot logic
//     let botResponseText = 'I am a basic banking bot. I can help with a few simple questions. Try asking about "login" or "transfer money".';

//     const lowerInput = input.toLowerCase();
//     if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
//       botResponseText = 'Hello! How can I assist you today?';
//     } else if (lowerInput.includes('login')) {
//       botResponseText = 'To log in, please enter your email and password on the login page.';
//     } else if (lowerInput.includes('transfer money')) {
//       botResponseText = 'You can transfer money from your dashboard by entering the recipient\'s email and the amount you wish to send.';
//     } else if (lowerInput.includes('balance')) {
//       botResponseText = 'Your current balance is shown on your dashboard after you log in.';
//     }

//     const botMessage = { text: botResponseText, sender: 'bot' };
//     setMessages([...newMessages, botMessage]);
//     setInput('');
//   };

//   return (
//     <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
//       <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
//         Chat with us
//       </div>
//       {isOpen && (
//         <div className="chatbot-body">
//           <div className="chatbot-messages">
//             {messages.length === 0 && <div className="initial-message">Hi! How can I help you?</div>}
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.sender}`}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <form onSubmit={handleSendMessage} className="chatbot-input">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;