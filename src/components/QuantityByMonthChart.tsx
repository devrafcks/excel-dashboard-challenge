import { type FC } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { QuantityByMonth } from '../types';
import { formatNumber } from '../utils';
import '../styles/CategoryChart.css';

const CHART_HEIGHT = 280;

type QuantityByMonthChartProps = {
  data: QuantityByMonth[];
};

export const QuantityByMonthChart: FC<QuantityByMonthChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    Mes: item.Mes,
    Quantidade: item.quantidade,
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Quantidade por Mês</h3>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="Mes" stroke="#718096" style={{ fontSize: '12px' }} />
          <YAxis
            stroke="#718096"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? formatNumber(value) : ''}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
          />
          <Bar dataKey="Quantidade" fill="#ed8936" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
