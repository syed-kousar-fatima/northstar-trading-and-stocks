export const marketIndices = [
  { name: 'S&P 500', symbol: 'SPX', value: '5,842.47', change: '+0.82%', positive: true },
  { name: 'NASDAQ', symbol: 'IXIC', value: '18,291.62', change: '+1.24%', positive: true },
  { name: 'DOW JONES', symbol: 'DJI', value: '42,215.18', change: '-0.18%', positive: false },
  { name: 'RUSSELL 2K', symbol: 'RUT', value: '2,184.06', change: '+0.46%', positive: true },
];

export const stocks = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 142.87, change: 3.42, cap: '3.49T', color: '#82c8ff', values: [38, 42, 37, 51, 47, 57, 55, 66, 61, 72, 70, 82, 77, 89, 84, 96] },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 232.61, change: 1.28, cap: '3.52T', color: '#a5b4fc', values: [46, 50, 47, 55, 53, 61, 58, 65, 63, 70, 67, 76, 72, 80, 78, 89] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 415.32, change: 0.86, cap: '3.09T', color: '#7dd3c7', values: [40, 45, 43, 52, 48, 56, 55, 62, 59, 67, 65, 71, 68, 80, 77, 85] },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 198.64, change: -0.74, cap: '2.08T', color: '#ffc987', values: [82, 77, 80, 71, 73, 65, 69, 61, 64, 56, 61, 51, 54, 46, 50, 43] },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Automotive', price: 338.11, change: 2.15, cap: '1.08T', color: '#f99b9b', values: [39, 43, 40, 50, 47, 56, 54, 63, 60, 69, 65, 77, 73, 86, 82, 94] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 186.92, change: -1.32, cap: '2.30T', color: '#c4a8f5', values: [87, 81, 85, 76, 78, 69, 73, 64, 67, 59, 63, 54, 58, 49, 52, 44] },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', price: 604.21, change: 1.93, cap: '1.53T', color: '#76b4ff', values: [42, 48, 45, 56, 51, 62, 58, 69, 66, 76, 71, 83, 79, 91, 87, 97] },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Finance', price: 248.76, change: -0.28, cap: '695B', color: '#f5cb79', values: [72, 68, 75, 70, 73, 65, 69, 63, 68, 61, 65, 58, 64, 59, 63, 57] },
];

export const initialPositions = [
  { symbol: 'NVDA', shares: 24, average: 128.4 },
  { symbol: 'AAPL', shares: 18, average: 219.72 },
  { symbol: 'MSFT', shares: 10, average: 398.05 },
];

export const initialTransactions = [
  { id: 1, type: 'Buy', symbol: 'NVDA', shares: 8, price: 138.42, date: 'Today, 10:42 AM', status: 'Completed' },
  { id: 2, type: 'Sell', symbol: 'AAPL', shares: 4, price: 229.18, date: 'Yesterday, 2:16 PM', status: 'Completed' },
  { id: 3, type: 'Buy', symbol: 'MSFT', shares: 5, price: 401.63, date: 'Oct 22, 2025', status: 'Completed' },
];

export const watchlistSymbols = ['NVDA', 'AAPL', 'TSLA', 'META'];

export function getStock(symbol) {
  return stocks.find((stock) => stock.symbol === symbol) ?? stocks[0];
}
