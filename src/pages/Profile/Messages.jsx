import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useGlobalContext } from '../../context/GlobalState';
import { Send, User, Headset } from 'lucide-react';

const Messages = () => {
    const { user, isAuthLoading } = useGlobalContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "messages"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            fetchedMessages.sort((a, b) => {
                const timeA = a.createdAt?.seconds || Date.now();
                const timeB = b.createdAt?.seconds || Date.now();
                return timeA - timeB;
            });
            
            setMessages(fetchedMessages);
        }, (error) => {
            console.error("Chat Error:", error);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const messageText = newMessage;
        setIsSending(true);
        setNewMessage(''); 

        try {
            await addDoc(collection(db, "messages"), {
                userId: user.uid,
                text: messageText,
                sender: 'user', 
                createdAt: serverTimestamp()
            });

            setTimeout(async () => {
                await addDoc(collection(db, "messages"), {
                    userId: user.uid,
                    text: "Thanks for reaching out! I'm a virtual assistant. A human agent will review your message about your order and get back to you shortly.",
                    sender: 'admin', 
                    createdAt: serverTimestamp()
                });
            }, 1500);

        } catch (error) {
            console.error("Error sending message:", error);
            setNewMessage(messageText); 
        } finally {
            setIsSending(false);
        }
    };

    if (isAuthLoading || !user) return null;

    return (
        <div className="bg-gray-50 min-h-[80vh] py-8 font-sans flex justify-center">
            <div className="w-full max-w-[1000px] px-4 h-[70vh] flex gap-6">
                
                <div className="w-80 hidden md:flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden shrink-0">
                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg cursor-pointer">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0">
                                <Headset size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-blue-900 text-sm">Customer Support</span>
                                <span className="text-xs text-blue-600 mt-0.5">Online • Replies typically in 2 hrs</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white shrink-0">
                        <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shrink-0 md:hidden">
                            <Headset size={20} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900">Customer Support Team</h3>
                            <span className="text-xs text-green-500 font-medium">● Available to help</span>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                        
                        <div className="flex items-start gap-3 max-w-[80%]">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                                <Headset size={16} className="text-gray-600" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-[15px]">
                                    Hello {user.displayName ? user.displayName.split(' ')[0] : 'there'}! How can we assist you with your order today?
                                </div>
                            </div>
                        </div>

                        {messages.map((msg) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <div key={msg.id} className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {isUser ? <User size={16} /> : <Headset size={16} />}
                                    </div>
                                    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3 rounded-2xl shadow-sm text-[15px] ${
                                            isUser 
                                                ? 'bg-[#0D6EFD] text-white rounded-tr-none' 
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                            {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message here..." 
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-colors"
                            />
                            <button 
                                type="submit" 
                                disabled={!newMessage.trim() || isSending}
                                className="w-12 h-12 bg-[#0D6EFD] text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm shrink-0"
                            >
                                <Send size={20} className="ml-1" />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Messages;