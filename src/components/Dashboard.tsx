import { useState, useMemo, type FC } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import type { DashboardData } from '../types';
import { processData, getUniqueCategories, getUniqueMonths } from '../utils';
import { Header } from './Header';
import { MetricsCards } from './MetricsCards';
import { CategoryChart } from './CategoryChart';
import { MonthChart } from './MonthChart';
import { QuantityByMonthChart } from './QuantityByMonthChart';
import { TopProductsChart } from './TopProductsChart';
import { ProductsTable } from './ProductsTable';
import { DataTable } from './DataTable';
import '../styles/Dashboard.css';

const FILTER_ALL_CATEGORIES = 'Todas as categorias';
const FILTER_ALL_MONTHS = 'Todos os meses';

type DashboardProps = {
  data: DashboardData;
  onNewFile: () => void;
};

export const Dashboard: FC<DashboardProps> = ({ data, onNewFile }) => {
  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL_CATEGORIES);
  const [selectedMonth, setSelectedMonth] = useState(FILTER_ALL_MONTHS);

  const uniqueCategories = useMemo(
    () => [FILTER_ALL_CATEGORIES, ...getUniqueCategories(data.raw_data)],
    [data.raw_data]
  );

  const uniqueMonths = useMemo(
    () => [FILTER_ALL_MONTHS, ...getUniqueMonths(data.raw_data)],
    [data.raw_data]
  );

  const filteredData = useMemo(() => {
    let filtered = data.raw_data;
    if (selectedCategory !== FILTER_ALL_CATEGORIES) {
      filtered = filtered.filter((r) => r.Categoria === selectedCategory);
    }
    if (selectedMonth !== FILTER_ALL_MONTHS) {
      filtered = filtered.filter((r) => r.Mes === selectedMonth);
    }
    return filtered;
  }, [data.raw_data, selectedCategory, selectedMonth]);

  const processedFilteredData = useMemo(() => processData(filteredData), [filteredData]);

  const handleClearFilters = () => {
    setSelectedCategory(FILTER_ALL_CATEGORIES);
    setSelectedMonth(FILTER_ALL_MONTHS);
  };

  const hasActiveFilters =
    selectedCategory !== FILTER_ALL_CATEGORIES || selectedMonth !== FILTER_ALL_MONTHS;
  const totalRecords = data.raw_data.length;

  return (
    <div className="dashboard">
      <Header onNewFile={onNewFile} />
      <div className="dashboard-content">
        <div className="dashboard-inner">
          <MetricsCards metrics={processedFilteredData.metrics} />
          {hasActiveFilters && (
            <div className="dashboard-summary">
              <span className="dashboard-summary-text">
                Filtros ativos: exibindo <strong>{filteredData.length}</strong> de{' '}
                <strong>{totalRecords}</strong> registros
                {totalRecords > 0 && (
                  <> ({((filteredData.length / totalRecords) * 100).toFixed(0)}%)</>
                )}
              </span>
            </div>
          )}
          <div className="charts-grid">
            <CategoryChart data={processedFilteredData.sales_by_category} />
            <MonthChart data={processedFilteredData.sales_by_month} />
            <QuantityByMonthChart data={processedFilteredData.quantity_by_month} />
            <TopProductsChart products={processedFilteredData.top_products} />
          </div>
          <div className="filters-card">
            <div className="filters-header">
              <Filter size={18} color="#3182ce" />
              <h3 className="filters-title">Filtros</h3>
            </div>
            <div className="filters-grid">
              <div>
                <label className="filters-label" htmlFor="filter-category">Categorias</label>
                <select
                  id="filter-category"
                  className="filters-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="filters-label" htmlFor="filter-month">Meses</label>
                <select
                  id="filter-month"
                  className="filters-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {uniqueMonths.map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="filters-clear" onClick={handleClearFilters}>
                <RotateCcw size={16} />
                Limpar
              </button>
            </div>
          </div>
          <ProductsTable products={processedFilteredData.top_products} />
          <DataTable data={filteredData} />
        </div>
      </div>
    </div>
  );
};
