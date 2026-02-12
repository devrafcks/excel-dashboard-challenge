export interface Sale {
  Data: string;
  Categoria: string;
  Codigo_Produto: string;
  Produto: string;
  Quantidade: number;
  Receita: number;
  Mes: string;
}

export interface Metrics {
  receita_total: number;
  pedidos_totais: number;
  ticket_medio: number;
  quantidade_total: number;
}

export interface SalesByCategory {
  Categoria: string;
  valor: number;
  percentual: number;
}

export interface SalesByMonth {
  Mes: string;
  valor: number;
}

export interface QuantityByMonth {
  Mes: string;
  quantidade: number;
}

export interface TopProduct {
  Produto: string;
  Categoria: string;
  Quantidade: number;
  Receita: number;
}

export interface DashboardData {
  metrics: Metrics;
  sales_by_category: SalesByCategory[];
  sales_by_month: SalesByMonth[];
  quantity_by_month: QuantityByMonth[];
  top_products: TopProduct[];
  raw_data: Sale[];
}