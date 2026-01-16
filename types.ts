
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number; // Percentage
  holdings: number;
}

export enum ViewState {
  MARKET_LIST = 'MARKET_LIST', // This is SPOT
  PERP = 'PERP',
  ACCOUNT = 'ACCOUNT',
  TRANSACTION = 'TRANSACTION',
}

export type TransactionType = 'BUY' | 'SELL';

export type KeyAction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'ENTER' | 'BACK' | 'L1' | 'R1' | 'X' | 'MENU';
