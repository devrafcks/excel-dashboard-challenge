import { type FC } from 'react';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import type { Metrics } from '../types';
import { formatCurrency, formatNumber } from '../utils';
import { SimpleCard } from './SimpleCard';
import '../styles/MetricsCards.css';

type MetricsCardsProps = {
  metrics: Metrics;
};

const ICON_PROPS = { size: 18 as const, color: '#3182ce' };

export const MetricsCards: FC<MetricsCardsProps> = ({ metrics }) => {
  const cards = [
    { label: 'Receita Total', value: formatCurrency(metrics.receita_total), icon: <DollarSign {...ICON_PROPS} /> },
    { label: 'Pedidos', value: formatNumber(metrics.pedidos_totais), icon: <ShoppingCart {...ICON_PROPS} /> },
    { label: 'Ticket Médio', value: formatCurrency(metrics.ticket_medio), icon: <TrendingUp {...ICON_PROPS} /> },
  ];
  return (
    <div className="metrics-grid">
      {cards.map((card) => (
        <SimpleCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
      ))}
    </div>
  );
};
