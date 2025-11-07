
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

interface HeaderProps {
  navigateToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ navigateToDashboard }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={navigateToDashboard}
          >
            <h1 className="text-2xl font-bold text-karmic-primary">
              Karmic Canteen
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-karmic-subtext">
              Welcome, <span className="font-semibold text-karmic-text">{user?.name}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-karmic-primary bg-blue-100 hover:bg-blue-200 rounded-md transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
