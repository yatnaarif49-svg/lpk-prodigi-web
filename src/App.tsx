import React from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { SiswaModule } from './components/SiswaModule';
import { SekolahModule } from './components/SekolahModule';
import { LpkPenyanggaModule } from './components/LpkPenyanggaModule';
import { MarketingTeamModule } from './components/MarketingTeamModule';
import { ToastViewport } from './components/ui/ToastViewport';
import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const { user, activePage } = useAuthStore();

  if (!user) {
    return (
      <>
        <LoginPage />
        <ToastViewport />
      </>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'siswa':
        return <SiswaModule />;
      case 'sekolah':
        return <SekolahModule />;
      case 'lpk_penyangga':
        return <LpkPenyanggaModule />;
      case 'marketing_team':
        return <MarketingTeamModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout>{renderContent()}</Layout>
      <ToastViewport />
    </>
  );
};

export default App;
