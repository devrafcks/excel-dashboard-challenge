import type {
  Sale,
  DashboardData,
  Metrics,
  SalesByCategory,
  SalesByMonth,
  QuantityByMonth,
  TopProduct,
} from './types';
import * as XLSX from 'xlsx';

export const MESES_ORDEM = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
] as const;

const MESES_VALIDOS = new Set<string>(MESES_ORDEM);

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const processExcelFile = async (file: File): Promise<DashboardData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        const processed = cleanData(rawData);
        const dashboardData = processData(processed);

        resolve(dashboardData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

const cleanData = (data: Record<string, unknown>[]): Sale[] => {
  return data
    .filter((row) => row.Categoria && row.Produto && row.Receita !== undefined)
    .map((row) => {
      const mes = extrairMes(String(row.Data ?? row.Mes ?? ''));
      return {
        Data: row.Data ? String(row.Data) : new Date().toISOString().split('T')[0],
        Categoria: normalizarCategoria(String(row.Categoria ?? '')),
        Codigo_Produto: String(row.Codigo_Produto ?? '').trim().toUpperCase(),
        Produto: String(row.Produto).trim(),
        Quantidade: parseInt(String(row.Quantidade), 10) || 0,
        Receita: parseFloat(String(row.Receita).replace('R$', '').replace(/\./g, '').replace(',', '.')) || 0,
        Mes: mes,
      };
    })
    .filter((row) => MESES_VALIDOS.has(row.Mes));
};

const extrairMes = (data: string): string => {
  if (!data) return 'Jan';
  const meses: Record<string, string> = {
    'janeiro': 'Jan', 'january': 'Jan', 'jan': 'Jan',
    'fevereiro': 'Fev', 'february': 'Fev', 'fev': 'Fev',
    'março': 'Mar', 'march': 'Mar', 'mar': 'Mar',
    'abril': 'Abr', 'april': 'Abr', 'abr': 'Abr',
    'maio': 'Mai', 'may': 'Mai', 'mai': 'Mai',
    'junho': 'Jun', 'june': 'Jun', 'jun': 'Jun',
    'julho': 'Jul', 'july': 'Jul', 'jul': 'Jul',
    'agosto': 'Ago', 'august': 'Ago', 'ago': 'Ago',
    'setembro': 'Set', 'september': 'Set', 'set': 'Set',
    'outubro': 'Out', 'october': 'Out', 'out': 'Out',
    'novembro': 'Nov', 'november': 'Nov', 'nov': 'Nov',
    'dezembro': 'Dez', 'december': 'Dez', 'dez': 'Dez',
  };

  const normalized = data.toString().trim().toLowerCase();
  const mesExistente = meses[normalized];
  if (mesExistente) return mesExistente;
  const regexData = /(\d{1,2})[/-](\d{1,2})[/-](\d{4})|(\d{4})[/-](\d{1,2})[/-](\d{1,2})/;
  const match = normalized.match(regexData);

  if (match) {
    let month: number;
    if (match[2]) {
      month = parseInt(match[2]);
    } else if (match[5]) {
      month = parseInt(match[5]);
    } else {
      return 'Jan';
    }

    return MESES_ORDEM[month - 1] ?? 'Jan';
  }

  return 'Jan';
};

const normalizarCategoria = (categoria: string): string => {
  const normalized = categoria.trim().toUpperCase();
  const mapa: Record<string, string> = {
    'ASSINATURA': 'ASSINATURAS',
    'ASSINATURAS': 'ASSINATURAS',
    'SERVIÇO': 'SERVICOS',
    'SERVIÇOS': 'SERVICOS',
    'SERVICOS': 'SERVICOS',
    'PRODUTO': 'PRODUTOS',
    'PRODUTOS': 'PRODUTOS',
  };
  return mapa[normalized] || normalized;
};

export const processData = (rawData: Sale[]): DashboardData => {
  const metrics = calculateMetrics(rawData);
  const salesByCategory = calculateSalesByCategory(rawData);
  const salesByMonth = calculateSalesByMonth(rawData);
  const quantityByMonth = calculateQuantityByMonth(rawData);
  const topProducts = calculateTopProducts(rawData, 10);

  return {
    metrics,
    sales_by_category: salesByCategory,
    sales_by_month: salesByMonth,
    quantity_by_month: quantityByMonth,
    top_products: topProducts,
    raw_data: rawData,
  };
};

const calculateMetrics = (data: Sale[]): Metrics => {
  const receita_total = data.reduce((sum, row) => sum + row.Receita, 0);
  const pedidos_totais = data.length;
  const ticket_medio = pedidos_totais > 0 ? receita_total / pedidos_totais : 0;
  const quantidade_total = data.reduce((sum, row) => sum + row.Quantidade, 0);

  return {
    receita_total,
    pedidos_totais,
    ticket_medio,
    quantidade_total,
  };
};

const calculateSalesByCategory = (data: Sale[]): SalesByCategory[] => {
  const grouped = new Map<string, number>();

  data.forEach((row) => {
    const current = grouped.get(row.Categoria) || 0;
    grouped.set(row.Categoria, current + row.Receita);
  });

  const total = Array.from(grouped.values()).reduce((a, b) => a + b, 0);

  return Array.from(grouped.entries())
    .map(([categoria, valor]) => ({
      Categoria: categoria,
      valor,
      percentual: total > 0 ? Math.round((valor / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.valor - a.valor);
};

const calculateSalesByMonth = (data: Sale[]): SalesByMonth[] => {
  const grouped = new Map<string, number>();
  data.forEach((row) => {
    const current = grouped.get(row.Mes) ?? 0;
    grouped.set(row.Mes, current + row.Receita);
  });
  return MESES_ORDEM
    .filter((mes) => grouped.has(mes))
    .map((mes) => ({ Mes: mes, valor: grouped.get(mes) ?? 0 }));
};

const calculateQuantityByMonth = (data: Sale[]): QuantityByMonth[] => {
  const grouped = new Map<string, number>();
  data.forEach((row) => {
    const current = grouped.get(row.Mes) ?? 0;
    grouped.set(row.Mes, current + row.Quantidade);
  });
  return MESES_ORDEM
    .filter((mes) => grouped.has(mes))
    .map((mes) => ({ Mes: mes, quantidade: grouped.get(mes) ?? 0 }));
};

const calculateTopProducts = (data: Sale[], limit: number): TopProduct[] => {
  const grouped = new Map<string, { categoria: string; quantidade: number; receita: number }>();

  data.forEach((row) => {
    const key = row.Produto;
    const current = grouped.get(key);

    if (current) {
      grouped.set(key, {
        categoria: row.Categoria,
        quantidade: current.quantidade + row.Quantidade,
        receita: current.receita + row.Receita,
      });
    } else {
      grouped.set(key, {
        categoria: row.Categoria,
        quantidade: row.Quantidade,
        receita: row.Receita,
      });
    }
  });

  return Array.from(grouped.entries())
    .map(([produto, info]) => ({
      Produto: produto,
      Categoria: info.categoria,
      Quantidade: info.quantidade,
      Receita: info.receita,
    }))
    .sort((a, b) => b.Receita - a.Receita)
    .slice(0, limit);
};

export const getUniqueCategories = (data: Sale[]): string[] => {
  return Array.from(new Set(data.map((row) => row.Categoria))).sort();
};

export const getUniqueMonths = (data: Sale[]): string[] => {
  const unique = new Set(data.map((row) => row.Mes));
  return MESES_ORDEM.filter((mes) => unique.has(mes));
};