
import React from 'react';
import { Role } from '../types';
import { SchoolIcon } from './Icons';

interface LoginProps {
  onLogin: (role: Role) => void;
}

const RoleButton: React.FC<{ role: Role, onClick: (role: Role) => void }> = ({ role, onClick }) => (
    <button
      onClick={() => onClick(role)}
      className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300 flex items-center space-x-4"
    >
      <div className="p-3 bg-primary-light rounded-full">
          <span className="text-2xl">{
              {
                  [Role.Student]: '🎓',
                  [Role.Parent]: '👨‍👩‍👧',
                  [Role.Teacher]: '🧑‍🏫',
                  [Role.Admin]: '⚙️',
              }[role]
          }</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{role}</h3>
        <p className="text-sm text-gray-500">Login as a {role}</p>
      </div>
    </button>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
            <div className="inline-block p-4 bg-primary rounded-full mb-4">
                <SchoolIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary-dark">Sheikh Nuur School Portal</h1>
            <p className="text-gray-600 mt-2">Welcome! Please select your role to continue.</p>
        </div>
        <div className="space-y-4">
          <RoleButton role={Role.Student} onClick={onLogin} />
          <RoleButton role={Role.Parent} onClick={onLogin} />
          <RoleButton role={Role.Teacher} onClick={onLogin} />
          <RoleButton role={Role.Admin} onClick={onLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
