
import React from 'react';
import { User, Role } from '../types';
import { MOCK_ATTENDANCE } from '../constants';
import { AttendanceIcon } from './Icons';

interface AttendanceProps {
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ user }) => {
    const isTeacherOrAdmin = user.role === Role.Teacher || user.role === Role.Admin;
    
    const getStatusColor = (status: 'Present' | 'Absent' | 'Late') => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-800';
            case 'Absent': return 'bg-red-100 text-red-800';
            case 'Late': return 'bg-yellow-100 text-yellow-800';
        }
    };

  return (
    <div>
      <div className="flex items-center mb-6">
        <AttendanceIcon className="w-8 h-8 text-primary"/>
        <h1 className="text-2xl font-bold text-gray-800 ml-3">{isTeacherOrAdmin ? 'Manage Attendance' : 'Attendance Record'}</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4">
            <h2 className="text-lg font-semibold">August 2024</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_ATTENDANCE.map((record) => (
              <tr key={record.date}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
