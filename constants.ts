import { Coin } from "./types";

export const MOCK_COINS: Coin[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change24h: 2.4, holdings: 0.15 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450.12, change24h: -1.2, holdings: 2.5 },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 145.60, change24h: 5.8, holdings: 100 },
  { id: '4', symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change24h: 0.5, holdings: 5000 },
  { id: '5', symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -3.4, holdings: 0 },
  { id: '6', symbol: 'XRP', name: 'Ripple', price: 0.60, change24h: 1.1, holdings: 0 },
  { id: '7', symbol: 'DOT', name: 'Polkadot', price: 7.20, change24h: -0.8, holdings: 0 },
];