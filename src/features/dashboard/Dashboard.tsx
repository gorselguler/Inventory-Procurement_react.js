/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrendingUp, Package, ShoppingCart, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Product, PurchaseOrder, PurchaseOrderStatus, StockStatus } from '../../types';

// Mock data for demonstration
const mockProducts: Product[] = [
  { id: '1', name: 'Industrial Controller V2', sku: 'IC-V2-001', category: 'Electronics', currentStock: 450, minThreshold: 100, unitPrice: 245.00, status: StockStatus.IN_STOCK },
  { id: '2', name: 'Hydraulic Pump HP-500', sku: 'HP-500-X', category: 'Mechanical', currentStock: 12, minThreshold: 15, unitPrice: 1240.00, status: StockStatus.LOW_STOCK },
  { id: '3', name: 'Steel Bearing 25mm', sku: 'SB-25-MM', category: 'Hardware', currentStock: 1200, minThreshold: 500, unitPrice: 4.50, status: StockStatus.IN_STOCK },
  { id: '4', name: 'Power Supply Unit 500W', sku: 'PSU-500-W', category: 'Electronics', currentStock: 0, minThreshold: 20, unitPrice: 85.00, status: StockStatus.OUT_OF_STOCK },
  { id: '5', name: 'Pneumatic Valve PV-12', sku: 'PV-12-Z', category: 'Mechanical', currentStock: 8, minThreshold: 10, unitPrice: 320.00, status: StockStatus.LOW_STOCK },
];

const mockOrders: PurchaseOrder[] = [
  { id: 'PO-001', supplierId: 'S1', items: [], totalAmount: 12000, status: PurchaseOrderStatus.PENDING, createdAt: '2024-03-20', expectedDeliveryDate: '2024-04-01' },
  { id: 'PO-002', supplierId: 'S2', items: [], totalAmount: 5400, status: PurchaseOrderStatus.PENDING, createdAt: '2024-03-22', expectedDeliveryDate: '2024-04-05' },
  { id: 'PO-003', supplierId: 'S1', items: [], totalAmount: 8900, status: PurchaseOrderStatus.APPROVED, createdAt: '2024-03-18', expectedDeliveryDate: '2024-03-28' },
];

const stockMovementData = [
  { name: 'Mon', inflow: 400, outflow: 240 },
  { name: 'Tue', inflow: 300, outflow: 139 },
  { name: 'Wed', inflow: 200, outflow: 980 },
  { name: 'Thu', inflow: 278, outflow: 390 },
  { name: 'Fri', inflow: 189, outflow: 480 },
  { name: 'Sat', inflow: 239, outflow: 380 },
  { name: 'Sun', inflow: 349, outflow: 430 },
];

export default function Dashboard() {
  const totalStockValue = mockProducts.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);
  const lowStockAlerts = mockProducts.filter(p => p.currentStock < p.minThreshold).length;
  const pendingOrders = mockOrders.filter(o => o.status === PurchaseOrderStatus.PENDING).length;

  const stats = [
    { 
      label: 'Total Stock Value', 
      value: `$${totalStockValue.toLocaleString()}`, 
      change: '+4.5%', 
      trend: 'up', 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Low Stock Alerts', 
      value: lowStockAlerts.toString(), 
      change: '+2 new', 
      trend: 'up', 
      icon: AlertTriangle, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    },
    { 
      label: 'Pending Orders', 
      value: pendingOrders.toString(), 
      change: '-12%', 
      trend: 'down', 
      icon: ShoppingCart, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Active Products', 
      value: mockProducts.length.toString(), 
      change: '+1', 
      trend: 'up', 
      icon: Package, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">DEPO 89 Overview</h2>
          <p className="text-zinc-500 mt-1">Real-time inventory and procurement intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/20">
            Create Purchase Order
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-orange-500" />
              <h3 className="text-lg font-bold text-zinc-900">Recent Stock Movements</h3>
            </div>
            <select className="bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMovementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#71717a' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="inflow" name="Stock In" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="outflow" name="Stock Out" fill="#18181b" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm p-6 text-white flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Inventory Health</h3>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live</span>
          </div>
          
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">In Stock</span>
                <span className="font-bold">82%</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Low Stock</span>
                <span className="font-bold">12%</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '12%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="h-full bg-orange-500" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Out of Stock</span>
                <span className="font-bold">6%</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '6%' }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                  className="h-full bg-rose-500" 
                />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-800">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Critical Alerts</p>
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle size={18} />
                <span className="text-sm font-medium">3 items below safety threshold</span>
              </div>
              <button className="w-full mt-4 py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
                Restock Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

