
import React from 'react';
import { User } from '../types';
import { NAV_LINKS, COMMON_NAV_LINKS, LOGOUT_LINK } from '../constants';
import { SchoolIcon } from './Icons';

interface SidebarProps {
  user: User;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  item: { id: string, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>> },
  isActive: boolean,
  onClick: () => void
}> = ({ item, isActive, onClick }) => (
  <a
    href={`#${item.id}`}
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
      isActive
        ? 'bg-primary text-white'
        : 'text-blue-100 hover:bg-primary-dark hover:text-white'
    }`}
  >
    <item.icon className="mr-3 h-6 w-6" />
    {item.label}
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ user, activePage, onNavigate, onLogout }) => {
  const roleNavLinks = NAV_LINKS[user.role];

  return (
    <div className="flex flex-col flex-1">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-dark">
            <SchoolIcon className="h-8 w-8 text-secondary" />
            <span className="ml-3 text-white text-lg font-semibold">Sheikh Nuur School</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto p-2">
            <div className="flex items-center flex-shrink-0 px-4 py-4">
                <img className="h-12 w-12 rounded-full" src={user.avatarUrl} alt="User avatar" />
                <div className="ml-4">
                    <p className="text-base font-semibold text-white">{user.name}</p>
                    <p className="text-sm font-medium text-blue-200">{user.role}</p>
                </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2 border-t border-blue-800">
                {roleNavLinks.map(item => (
                    <NavItem key={item.id} item={item} isActive={activePage === item.id} onClick={() => onNavigate(item.id)} />
                ))}
            </nav>
             <nav className="px-2 py-4 space-y-2 border-t border-blue-800">
                {COMMON_NAV_LINKS.map(item => (
                     <NavItem key={item.id} item={item} isActive={activePage === item.id} onClick={() => onNavigate(item.id)} />
                ))}
            </nav>
            <div className="px-2 py-4 mt-auto border-t border-blue-800">
                <NavItem item={LOGOUT_LINK} isActive={false} onClick={onLogout} />
            </div>
        </div>
    </div>
  );
};

export default Sidebar;
