import React, { useState, useMemo } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { User } from './types';
import LoginScreen from './components/auth/LoginScreen';
import DashboardScreen from './components/dashboard/DashboardScreen';
import DailyScreen from './components/daily/DailyScreen';
import WeeklyScreen from './components/weekly/WeeklyScreen';
import Header from './components/ui/Header';

type Screen = 'login' | 'dashboard' | 'daily' | 'weekly';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('login');

  const authContextValue = useMemo(() => ({
    user,
    login: (loggedInUser: User) => {
      setUser(loggedInUser);
      setScreen('dashboard');
    },
    logout: () => {
      setUser(null);
      setScreen('login');
    },
  }), [user]);

  const navigateTo = (newScreen: Screen) => {
    setScreen(newScreen);
  };
  
  const navigateToDashboard = () => setScreen('dashboard');

  const renderScreen = () => {
    if (!user) {
      return <LoginScreen />;
    }
    switch (screen) {
      case 'dashboard':
        return <DashboardScreen navigateTo={navigateTo} />;
      case 'daily':
        return <DailyScreen navigateToDashboard={navigateToDashboard} />;
      case 'weekly':
        return <WeeklyScreen navigateToDashboard={navigateToDashboard} />;
      default:
        return <DashboardScreen navigateTo={navigateTo} />;
    }
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen bg-karmic-bg text-karmic-text font-sans">
        {user && <Header navigateToDashboard={navigateToDashboard} />}
        <main className="p-4 md:p-8">
          {renderScreen()}
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default App;