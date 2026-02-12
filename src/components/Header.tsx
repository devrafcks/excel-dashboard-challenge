import { type FC } from 'react';
import { Plus } from 'lucide-react';
import '../styles/Header.css';

type HeaderProps = {
  onNewFile: () => void;
};

export const Header: FC<HeaderProps> = ({ onNewFile }) => (
  <header className="header">
    <div className="header-inner">
      <div>
      <p className="header-subtitle">INTELIGÊNCIA DE DADOS</p>
      <h1 className="header-title">Dashboard Analítico</h1>

      </div>
      <button type="button" className="header-btn" onClick={onNewFile}>
        <Plus size={16} />
        Novo Arquivo
      </button>
    </div>
  </header>
);
