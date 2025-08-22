import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LendingPools } from './components/LendingPools';
import { Portfolio } from './components/Portfolio';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';

type ActiveTab = 'landing' | 'dashboard' | 'lending' | 'portfolio' | 'analytics' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard />;
      case 'lending':
        return <LendingPools />;
      case 'portfolio':
        return <Portfolio />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <WalletProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
          {activeTab !== 'landing' && (
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
          <main className={activeTab !== 'landing' ? 'pt-16' : ''}>
            {renderActiveComponent()}
          </main>
        </div>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;