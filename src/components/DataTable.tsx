import { useState, useMemo, type FC } from 'react';
import { Search } from 'lucide-react';
import type { Sale } from '../types';
import { formatCurrency } from '../utils';
import '../styles/DataTable.css';

type DataTableProps = {
  data: Sale[];
};

type SortConfig = {
  key: keyof Sale;
  direction: 'asc' | 'desc';
};

const COLUMNS: (keyof Sale)[] = ['Data', 'Categoria', 'Produto', 'Codigo_Produto', 'Mes', 'Quantidade', 'Receita'];
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_ITEMS_PER_PAGE = 10;

function matchSearch(row: Sale, term: string): boolean {
  if (!term.trim()) return true;
  const t = term.trim().toLowerCase();
  const fields = [row.Data, row.Categoria, row.Produto, row.Codigo_Produto, row.Mes];
  return fields.some((f) => String(f).toLowerCase().includes(t));
}

export const DataTable: FC<DataTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'Receita', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string);
        }
        return sortConfig.direction === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }),
    [data, sortConfig]
  );

  const filteredData = useMemo(
    () => sortedData.filter((row) => matchSearch(row, searchTerm)),
    [sortedData, searchTerm]
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: keyof Sale) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="data-table-card">
      <div className="data-table-header">
        <h3 className="data-table-title">Todos os Dados</h3>
        <div className="data-table-toolbar">
          <div className="data-table-search-wrap">
            <Search size={18} className="data-table-search-icon" />
            <input
              type="search"
              className="data-table-search"
              placeholder="Buscar (produto, categoria, mês...)"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Buscar nos dados"
            />
          </div>
          <div className="data-table-per-page">
            <label htmlFor="data-table-ipp" className="data-table-per-page-label">
              Por página
            </label>
            <select
              id="data-table-ipp"
              className="data-table-per-page-select"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} onClick={() => handleSort(col)}>
                  {col}
                  {sortConfig.key === col && (
                    <span className="sort-icon">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="data-table-empty">
                  {searchTerm.trim() ? 'Nenhum registro encontrado para a busca.' : 'Nenhum dado disponível.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={`${row.Data}-${row.Produto}-${index}`}>
                  <td>{row.Data}</td>
                  <td><span className="badge">{row.Categoria}</span></td>
                  <td className="product-name">{row.Produto}</td>
                  <td>{row.Codigo_Produto}</td>
                  <td>{row.Mes}</td>
                  <td className="num">{row.Quantidade}</td>
                  <td className="receita">{formatCurrency(row.Receita)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="data-table-pagination">
        <span className="data-table-pagination-info">
          Mostrando {filteredData.length === 0 ? 0 : startIndex + 1} a{' '}
          {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length}
          {searchTerm.trim() && ` (filtrado por busca)`}
        </span>
        <div className="data-table-pagination-btns">
          <button
            type="button"
            className="data-table-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="data-table-pagination-page">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="data-table-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};
