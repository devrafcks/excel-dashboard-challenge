import { type FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SalesByMonth } from '../types';
import { formatCurrency } from '../utils';
import '../styles/CategoryChart.css';

const CHART_HEIGHT = 280;

type MonthChartProps = {
  data: SalesByMonth[];
};

export const MonthChart: FC<MonthChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    Mes: item.Mes,
    Vendas: item.valor,
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Vendas por Mês</h3>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="Mes" stroke="#718096" style={{ fontSize: '12px' }} />
          <YAxis
            stroke="#718096"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? formatCurrency(value) : ''}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
          />
          <Legend />
          <Bar dataKey="Vendas" fill="#3182ce" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
