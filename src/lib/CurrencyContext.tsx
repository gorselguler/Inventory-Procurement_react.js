import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = {
  code: string;
  symbol: string;
  label: string;
};

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'PLN', symbol: 'zł', label: 'Polish Zloty' },
  { code: 'TRY', symbol: '₺', label: 'Turkish Lira' },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  currencies: Currency[];
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, _setCurrency] = useState<Currency>(currencies[0]);

  const setCurrency = (code: string) => {
    const newCurrency = currencies.find(c => c.code === code);
    if (newCurrency) {
      _setCurrency(newCurrency);
    }
  };

  const formatPrice = (amount: number) => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencies, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
