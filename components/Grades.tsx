
import React from 'react';
import { User, Role } from '../types';
import { MOCK_GRADES, MOCK_COURSES } from '../constants';
import { GradeIcon } from './Icons';

interface GradesProps {
  user: User;
}

const Grades: React.FC<GradesProps> = ({ user }) => {
    const isTeacherOrAdmin = user.role === Role.Teacher || user.role === Role.Admin;
  return (
    <div>
        <div className="flex items-center mb-6">
            <GradeIcon className="w-8 h-8 text-primary"/>
            <h1 className="text-2xl font-bold text-gray-800 ml-3">{isTeacherOrAdmin ? 'Manage Grades' : 'Your Grades'}</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {MOCK_GRADES.map((grade) => {
                        const course = MOCK_COURSES.find(c => c.id === grade.courseId);
                        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
                        return (
                            <tr key={grade.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.assignmentTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.score} / {grade.maxScore}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="ml-3 font-semibold">{percentage}%</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Grades;
