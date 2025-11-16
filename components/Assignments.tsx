
import React from 'react';
import { User, Role, Assignment } from '../types';
import { MOCK_ASSIGNMENTS, MOCK_COURSES } from '../constants';
import { AssignmentIcon } from './Icons';

interface AssignmentsProps {
    user: User;
}

const AssignmentCard: React.FC<{ assignment: Assignment }> = ({ assignment }) => {
    const course = MOCK_COURSES.find(c => c.id === assignment.courseId);
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{course?.name}</p>
                <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                <p className="text-sm text-gray-600">Due: {assignment.dueDate}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                assignment.submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {assignment.submitted ? 'Submitted' : 'Pending'}
            </span>
        </div>
    );
};

const Assignments: React.FC<AssignmentsProps> = ({ user }) => {
    const isTeacherOrAdmin = user.role === Role.Teacher || user.role === Role.Admin;

    return (
        <div>
            <div className="flex items-center mb-6">
                <AssignmentIcon className="w-8 h-8 text-primary"/>
                <h1 className="text-2xl font-bold text-gray-800 ml-3">{isTeacherOrAdmin ? 'Manage Assignments' : 'Your Assignments'}</h1>
            </div>
            
            {isTeacherOrAdmin && (
                <div className="mb-6">
                    <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow transition-colors">
                        + Create New Assignment
                    </button>
                </div>
            )}
            
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Upcoming</h2>
                {MOCK_ASSIGNMENTS.filter(a => !a.submitted).map(assignment => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}

                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-6">Completed</h2>
                {MOCK_ASSIGNMENTS.filter(a => a.submitted).map(assignment => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                ))}
            </div>
        </div>
    );
};

export default Assignments;
