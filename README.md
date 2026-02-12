# Dashboard 

Aplicação web desenvolvida como teste técnico. Permite o upload de um arquivo Excel e gera um dashboard com análise, organização e apresentação dos dados ao usuário.

---

## Objetivo do teste

Desenvolver uma aplicação web que permita o upload de um arquivo Excel e gere um dashboard de vendas semelhante ao modelo solicitado, considerando não apenas a visualização dos dados, mas também a forma como eles são analisados, organizados e apresentados ao usuário.

---

## O que foi entregue

- **Leitura do Excel**: upload de arquivos `.xlsx` e `.xls` via arrastar-e-soltar ou seletor de arquivo.
- **Análise e limpeza dos dados**: normalização de categorias e meses, validação de campos obrigatórios (Categoria, Produto, Receita), extração de mês a partir de datas ou texto.
- **Dashboard**: métricas (Receita Total, Pedidos, Ticket Médio), gráficos padronizados (máximo 2 por linha, responsivo) e tabelas.
- **Gráficos implementados**:
  - Vendas por Categoria (pizza)
  - Vendas por Mês (barras verticais)
  - Quantidade por Mês (barras verticais)
  - Top 5 Produtos por Receita (barras horizontais)
- **Filtros**: por Categoria e por Mês, com opção “Limpar”; resumo exibindo quantidade de registros quando há filtros ativos.
- **Tabelas**: “Produtos Mais Vendidos” e “Todos os Dados” (ordenável por coluna, paginada, busca em tempo real e seletor de itens por página: 10, 25, 50, 100).
- **Responsividade**: layout adaptável; grid de gráficos em 2 colunas em telas maiores e 1 coluna em telas menores; tabelas com scroll horizontal quando necessário; cabeçalhos e dados alinhados à esquerda.

---

## Etapas seguidas no desenvolvimento

1. **Estrutura do projeto**: React 19 + TypeScript + Vite 7; definição de tipos em `types.ts` e funções de processamento em `utils.ts`.
2. **Leitura e limpeza do Excel**: uso da biblioteca `xlsx` para ler a primeira planilha; filtragem de linhas inválidas; normalização de categorias (ex.: ASSINATURA → ASSINATURAS) e de meses (Jan–Dez); parsing de Receita e Quantidade.
3. **Agregações**: cálculo de métricas (receita total, pedidos, ticket médio, quantidade total); vendas por categoria com percentual; vendas e quantidade por mês; top produtos por receita.
4. **Interface**: componente de upload (DropZone); header com “Novo Arquivo”; dashboard com cards de métricas, grid de gráficos (Recharts), painel de filtros, tabela de top produtos e tabela completa com ordenação, paginação e busca.

---

## Requisitos atendidos

- Código organizado e claro.
- README com etapas seguidas durante o desenvolvimento.

---

## Stack utilizada

- React 19 com TypeScript
- Vite 7 (build e servidor de desenvolvimento)
- Recharts (gráficos)
- xlsx (leitura de Excel)
- lucide-react (ícones)
- ESLint (lint)

---

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+ (ou yarn/pnpm)

---

## Instalação e execução

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`

**Build para produção:**

```bash
npm run build
npm run preview
```

A pasta `dist` contém os arquivos estáticos.

---

## Formato esperado do Excel

Colunas utilizadas: **Data**, **Categoria**, **Codigo_Produto**, **Produto**, **Quantidade**, **Receita**, **Mes** (ou derivação de Data). Meses são normalizados para abreviações Jan–Dez. Linhas sem Categoria, Produto ou Receita são ignoradas.

---

## Scripts

| Script              | Descrição                      |
| ------------------- | -------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento      |
| `npm run build`   | Compila e gera build em `dist` |
| `npm run preview` | Serve `dist` localmente        |
| `npm run lint`    | Executa ESLint                   |

---

