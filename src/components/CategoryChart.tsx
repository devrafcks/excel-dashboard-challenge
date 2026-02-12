import { type FC } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { SalesByCategory } from '../types';
import '../styles/CategoryChart.css';

const CHART_HEIGHT = 280;
const COLORS = ['#1a5276', '#3182ce', '#ed8936'];

type CategoryChartProps = {
  data: SalesByCategory[];
};

export const CategoryChart: FC<CategoryChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.Categoria,
    value: item.percentual,
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Vendas por Categoria</h3>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine
            label={({ value }) => `${Number(value).toFixed(1)}%`}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number | undefined) => value != null ? `${value.toFixed(1)}%` : ''} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
