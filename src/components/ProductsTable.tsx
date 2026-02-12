import { type FC } from 'react';
import { Package } from 'lucide-react';
import type { TopProduct } from '../types';
import { formatCurrency } from '../utils';
import '../styles/ProductsTable.css';

type ProductsTableProps = {
  products: TopProduct[];
};

export const ProductsTable: FC<ProductsTableProps> = ({ products }) => (
  <div className="products-card">
    <div className="products-header">
      <Package size={20} color="#3182ce" />
      <h3 className="products-title">Produtos Mais Vendidos</h3>
    </div>
    <div className="products-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Qtd</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={`${product.Produto}-${index}`}>
              <td className="product-name">{product.Produto}</td>
              <td className="category">
                <span className="badge">{product.Categoria}</span>
              </td>
              <td className="qty">{product.Quantidade}</td>
              <td className="value">{formatCurrency(product.Receita)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
