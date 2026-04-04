/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Package, Truck, ShoppingCart, LayoutDashboard, Settings, Menu, X, Coins } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '@/src/lib/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className={`h-screen bg-zinc-950 text-zinc-400 border-r border-zinc-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h1 className="text-white font-bold tracking-tight text-xl">DEPO 89</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-zinc-800 rounded-md transition-colors">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-orange-500' : ''} />
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-900 mt-auto">
        <div className={`p-2 rounded-lg bg-zinc-900/50 flex flex-col gap-2 ${!isOpen ? 'items-center' : ''}`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <Coins size={14} />
            {isOpen && <span>Currency</span>}
          </div>
          {isOpen ? (
            <Select value={currency.code} onValueChange={setCurrency}>
              <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-zinc-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                {currencies.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <button 
              className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = currencies.findIndex(c => c.code === currency.code);
                const nextIndex = (currentIndex + 1) % currencies.length;
                setCurrency(currencies[nextIndex].code);
              }}
              title={`Switch Currency (Current: ${currency.code})`}
            >
              {currency.symbol}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
