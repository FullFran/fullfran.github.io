import React, { useState } from 'react';
import LandingPage from './LandingPage';
import Layout from './Layout';
import Portfolio from './Portfolio';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'terminal' | 'landing'>('landing');

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'landing' ? <LandingPage /> : <Portfolio onExitTerminal={() => setCurrentView('landing')} />}
    </Layout>
  );
};

export default App;
