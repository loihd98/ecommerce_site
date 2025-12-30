'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '@/store/hooks';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !ws) {
            connectWebSocket();
        }

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [isOpen]);

    const connectWebSocket = () => {
        try {
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000';
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log('WebSocket connected');
                // Send initial greeting
                const greeting: Message = {
                    id: Date.now().toString(),
                    text: isAuthenticated
                        ? `Hello ${user?.name || 'there'}! How can I help you today?`
                        : "Hello! Welcome to our store. How can I assist you today?",
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages([greeting]);
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'message') {
                        const botMessage: Message = {
                            id: Date.now().toString(),
                            text: data.text,
                            sender: 'bot',
                            timestamp: new Date(),
                        };
                        setMessages((prev) => [...prev, botMessage]);
                        setIsTyping(false);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                // Fallback to mock responses if WebSocket fails
                setWs(null);
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
                setWs(null);
            };

            setWs(socket);
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // If WebSocket is available, send through it
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'message',
                text: inputMessage,
                userId: user?.id || 'guest',
            }));
        } else {
            // Fallback to mock responses
            setTimeout(() => {
                const botResponse = getBotResponse(inputMessage);
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: botResponse,
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMessage]);
                setIsTyping(false);
            }, 1000);
        }
    };

    const getBotResponse = (message: string): string => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! How can I help you today?';
        }

        if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
            return isAuthenticated
                ? 'You can track your orders in the Orders section. Would you like me to help you with a specific order?'
                : 'Please log in to track your orders. You can find the login button in the navigation menu.';
        }

        if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return 'We offer a 30-day return policy. You can initiate a return from your order details page. Is there a specific order you need help with?';
        }

        if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
            return 'We offer free shipping on orders over $100. Standard delivery takes 3-5 business days. Express delivery is also available.';
        }

        if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
            return 'We accept credit/debit cards and cash on delivery. All card transactions are secure and encrypted.';
        }

        if (lowerMessage.includes('product') || lowerMessage.includes('item')) {
            return 'You can browse our products by category or use the search feature. Is there a specific product you\'re looking for?';
        }

        if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
            return isAuthenticated
                ? 'You can manage your account settings, addresses, and preferences in the Account section.'
                : 'Please create an account or log in to access your profile and order history.';
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
            return 'You can reach our customer support team at support@example.com or call us at 1-800-123-4567. We\'re here 24/7!';
        }

        return 'I\'m here to help! You can ask me about orders, shipping, returns, products, or anything else. What would you like to know?';
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Social Media Buttons - Messenger and Zalo */}
            {!isOpen && (
                <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 flex flex-col gap-3 z-50">
                    {/* Messenger Button */}
                    <a
                        href="https://www.facebook.com/share/1D1MmND8K5/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all group relative animate-fade-in"
                        aria-label="Contact via Messenger"
                    >
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.45 5.51 3.717 7.197V22l3.517-1.93c.938.26 1.932.401 2.766.401 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.416l-2.557-2.73-4.992 2.73 5.49-5.827 2.62 2.73 4.93-2.73-5.491 5.827z" />
                        </svg>
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                            Messenger
                        </span>
                    </a>

                    {/* Zalo Button */}
                    <a
                        href="https://zalo.me/0342429911"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all group relative animate-fade-in"
                        style={{ animationDelay: '100ms' }}
                        aria-label="Contact via Zalo"
                    >
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.248.622.283 1.154.905.905l3.032-.893A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm3.5 13h-7a.5.5 0 010-1h7a.5.5 0 010 1zm0-2.5h-7a.5.5 0 010-1h7a.5.5 0 010 1zM13 10H8.5a.5.5 0 010-1H13a.5.5 0 010 1z" />
                        </svg>
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                            Zalo
                        </span>
                    </a>
                </div>
            )}

            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-gray-800 transition-all z-50 group"
                    aria-label="Open chat"
                >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        1
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 w-full sm:w-96 h-[100dvh] sm:h-[600px] sm:max-h-[90vh] bg-white sm:rounded-lg shadow-2xl flex flex-col z-50 border-t sm:border border-gray-200">
                    {/* Header */}
                    <div className="bg-black text-white px-3 sm:px-4 py-3 sm:rounded-t-lg flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base truncate">Customer Support</h3>
                                <p className="text-xs text-gray-300 hidden sm:block">Online - We reply instantly</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-gray-800 rounded p-1 transition-colors flex-shrink-0"
                            aria-label="Close chat"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg px-4 py-2">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim()}
                                className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
