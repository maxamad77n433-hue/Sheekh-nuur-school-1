
import React, { useState, useCallback, useMemo } from 'react';
import { User, Role } from './types';
import { MOCK_USERS } from './constants';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Assignments from './components/Assignments';
import Grades from './components/Grades';
import Attendance from './components/Attendance';
import FeeStatus from './components/FeeStatus';
import SchoolProfile from './components/SchoolProfile';
import AITools from './components/AITools';

export const UserContext = React.createContext<{ user: User | null; onLogout: () => void; } | null>(null);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<string>('dashboard');

  const handleLogin = useCallback((role: Role) => {
    const user = MOCK_USERS[role];
    if (user) {
      setCurrentUser(user);
      setActivePage('dashboard');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setActivePage('dashboard');
  }, []);
  
  const handleNavigate = useCallback((page: string) => {
    setActivePage(page);
  }, []);

  const contextValue = useMemo(() => ({ user: currentUser, onLogout: handleLogout }), [currentUser, handleLogout]);

  const renderPage = () => {
    if (!currentUser) return null;
    switch (activePage) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'assignments':
        return <Assignments user={currentUser} />;
      case 'grades':
        return <Grades user={currentUser} />;
      case 'attendance':
        return <Attendance user={currentUser} />;
      case 'fees':
        return <FeeStatus user={currentUser} />;
      case 'profile':
        return <SchoolProfile />;
      case 'ai-tools':
        return <AITools />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <UserContext.Provider value={contextValue}>
        <Layout user={currentUser} activePage={activePage} onNavigate={handleNavigate}>
          {renderPage()}
        </Layout>
    </UserContext.Provider>
  );
};

export default App;
