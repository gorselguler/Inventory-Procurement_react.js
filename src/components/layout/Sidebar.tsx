/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Package, Truck, ShoppingCart, LayoutDashboard, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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

  return (
    <div className={`h-screen bg-zinc-950 text-zinc-400 border-r border-zinc-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h1 className="text-white font-bold tracking-tight text-xl">DEPO 89</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-zinc-800 rounded-md transition-colors">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-3 space-y-1">
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

      <div className="absolute bottom-6 px-6 w-full">
        {isOpen && (
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">System Status</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-zinc-300">All systems online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
