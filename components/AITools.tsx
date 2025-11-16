
import React, { useState } from 'react';
import { AIToolsIcon } from './Icons';
import Chatbot from './ai/Chatbot';
import ImageTools from './ai/ImageTools';
import VideoTools from './ai/VideoTools';
import AnalysisTools from './ai/AnalysisTools';
import LessonPlanner from './ai/LessonPlanner';
import VoiceAssistant from './ai/VoiceAssistant';

const AITools: React.FC = () => {
    const [activeTab, setActiveTab] = useState('chatbot');

    const tabs = [
        { id: 'chatbot', label: 'AI Chat Assistant' },
        { id: 'voice-assistant', label: 'Voice Assistant' },
        { id: 'image', label: 'Image Tools' },
        { id: 'video', label: 'Video Tools' },
        { id: 'analysis', label: 'Analysis Tools' },
        { id: 'lesson-planner', label: 'Lesson Planner' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'chatbot': return <Chatbot />;
            case 'image': return <ImageTools />;
            case 'video': return <VideoTools />;
            case 'analysis': return <AnalysisTools />;
            case 'lesson-planner': return <LessonPlanner />;
            case 'voice-assistant': return <VoiceAssistant />;
            default: return null;
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <AIToolsIcon className="w-8 h-8 text-primary"/>
                <h1 className="text-2xl font-bold text-gray-800 ml-3">AI Powered Tools</h1>
            </div>
            
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AITools;
