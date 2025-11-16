
import React from 'react';
import { User } from '../types';
import { MOCK_FEES } from '../constants';
import { FeeIcon } from './Icons';

interface FeeStatusProps {
    user: User;
}

const FeeStatus: React.FC<FeeStatusProps> = ({ user }) => {

    const getStatusPill = (status: 'Paid' | 'Unpaid') => {
        return status === 'Paid' ?
            <span className="px-3 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Paid</span> :
            <span className="px-3 py-1 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">Unpaid</span>;
    };
    
    return (
        <div>
            <div className="flex items-center mb-6">
                <FeeIcon className="w-8 h-8 text-primary"/>
                <h1 className="text-2xl font-bold text-gray-800 ml-3">Fee Status</h1>
            </div>

            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {MOCK_FEES.map((fee) => (
                            <tr key={fee.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fee.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.dueDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {getStatusPill(fee.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-600">Total Paid:</p>
                    <p className="font-bold text-green-600">$525.00</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600">Total Unpaid:</p>
                    <p className="font-bold text-red-600">$500.00</p>
                </div>
            </div>
        </div>
    );
}

export default FeeStatus;
