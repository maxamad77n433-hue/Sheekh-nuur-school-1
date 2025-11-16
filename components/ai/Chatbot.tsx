
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { GoogleGenAI, Chat } from '@google/genai';
import { SparklesIcon } from '../Icons';

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are a friendly and helpful school assistant for Sheikh Nuur School. Answer questions about school topics, homework, and general knowledge. Keep responses concise and encouraging.',
            },
        });
        setChat(chatInstance);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || loading || !chat) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            let response = await chat.sendMessageStream({ message: input });
            let modelResponseText = '';
            setMessages(prev => [...prev, { sender: 'model', text: '' }]);

            for await (const chunk of response) {
                modelResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponseText;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 h-[70vh] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                <SparklesIcon className="text-primary mr-2" />
                School Helper Chat
            </h2>
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                               <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {loading && messages[messages.length-1]?.sender === 'user' && (
                         <div className="flex items-end justify-start">
                            <div className="px-4 py-2 rounded-2xl max-w-lg bg-gray-200 text-gray-800 rounded-bl-none">
                                <div className="flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s] mx-1"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="mt-auto flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about homework, school events..."
                    className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    className="bg-primary text-white p-3 rounded-r-lg hover:bg-primary-dark disabled:bg-gray-400"
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
