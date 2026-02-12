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
  Cell,
} from 'recharts';
import type { TopProduct } from '../types';
import { formatCurrency } from '../utils';
import '../styles/TopProductsChart.css';

const TOP_N = 5;
const CHART_HEIGHT = 280;
const COLORS = ['#3182ce', '#2c5aa0', '#1a5276', '#ed8936', '#c05621'];

type TopProductsChartProps = {
  products: TopProduct[];
};

export const TopProductsChart: FC<TopProductsChartProps> = ({ products }) => {
  const chartData = products.slice(0, TOP_N).map((p) => ({
    nome: p.Produto.length > 25 ? `${p.Produto.slice(0, 25)}…` : p.Produto,
    Receita: p.Receita,
    fullName: p.Produto,
  }));

  return (
    <div className="chart-card top-products-chart">
      <h3 className="chart-title">Top 5 Produtos por Receita</h3>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            stroke="#718096"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="nome"
            width={120}
            stroke="#718096"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#2d3748' }}
          />
          <Tooltip
            formatter={(value: number | undefined) => value != null ? formatCurrency(value) : ''}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div className="chart-tooltip">
                  <p className="chart-tooltip-label">{payload[0].payload.fullName}</p>
                  <p className="chart-tooltip-value">{formatCurrency(Number(payload[0].value ?? 0))}</p>
                </div>
              ) : null
            }
          />
          <Legend />
          <Bar dataKey="Receita" name="Receita" radius={[0, 4, 4, 0]} minPointSize={8}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
