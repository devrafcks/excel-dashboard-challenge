import { useState, type FC } from 'react';
import type { DashboardData } from './types';
import { processExcelFile } from './utils';
import { DropZone } from './components/DropZone';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { AlertCircle } from 'lucide-react';
import './styles/App.css';

const App: FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await processExcelFile(file);
      setDashboardData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao processar arquivo. Verifique o formato e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewFile = () => {
    setDashboardData(null);
    setError(null);
  };

  if (dashboardData) {
    return <Dashboard data={dashboardData} onNewFile={handleNewFile} />;
  }

  return (
    <div className="app">
      <Header onNewFile={handleNewFile} />
      {error && (
        <div className="error-banner">
          <div className="error-inner">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button type="button" className="error-close" onClick={() => setError(null)} aria-label="Fechar">
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="app-content">
        <DropZone onFileSelect={handleFileSelect} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
