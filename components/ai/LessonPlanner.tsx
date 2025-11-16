
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from '../Icons';

const LessonPlanner: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState('5');
    const [lessonPlan, setLessonPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setError(null);
        setLessonPlan('');

        const prompt = `Create a comprehensive lesson plan for a grade ${gradeLevel} class on the topic: "${topic}". 
        Include the following sections:
        1. Learning Objectives (3-4 clear objectives)
        2. Materials and Resources
        3. Step-by-step Procedure (including an introduction, main activity, and conclusion)
        4. Assessment Methods
        5. Differentiated Instruction for diverse learners.
        Format the output as clear, well-structured markdown.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    thinkingConfig: { thinkingBudget: 32768 },
                },
            });
            setLessonPlan(response.text);
        } catch (e: any) {
            console.error(e);
            setError(`Failed to generate lesson plan: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><SparklesIcon className="text-primary mr-2" />AI Lesson Planner</h3>
            <p className="text-gray-600 mb-4">For teachers: Enter a topic and grade level to generate a detailed lesson plan using Gemini's advanced reasoning.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Water Cycle"
                    className="md:col-span-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="text"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="e.g., Grade 5"
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-white p-2 rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
                {loading ? 'Thinking...' : 'Generate Lesson Plan'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {lessonPlan && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-lg mb-2">Generated Lesson Plan:</h4>
                    <pre className="text-gray-800 whitespace-pre-wrap font-sans bg-white p-4 rounded">{lessonPlan}</pre>
                </div>
            )}
        </div>
    );
};

export default LessonPlanner;
