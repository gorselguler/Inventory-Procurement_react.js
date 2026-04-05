/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './features/dashboard/Dashboard';
import Inventory from './features/inventory/Inventory';
import { AnimatePresence, motion } from 'motion/react';
import { Product, PurchaseOrder } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} orders={orders} />;
      case 'inventory':
        return <Inventory products={products} setProducts={setProducts} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] text-zinc-400">
            <div className="p-8 bg-zinc-50 rounded-full border border-zinc-100 mb-6">
              <span className="text-4xl font-bold text-zinc-200 uppercase tracking-widest">{activeTab}</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900">Feature Under Development</h3>
            <p className="mt-2 text-zinc-500">We're currently building the {activeTab} module. Check back soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto bg-zinc-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

