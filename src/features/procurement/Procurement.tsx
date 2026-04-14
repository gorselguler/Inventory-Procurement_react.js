/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Package, Search, Filter, Plus, CheckCircle2, XCircle, Clock, Truck, Eye } from 'lucide-react';
import { PurchaseOrder, PurchaseOrderStatus, Product, StockStatus, Supplier } from '../../types';
import { useCurrency } from '@/src/lib/CurrencyContext';
import { motion } from 'motion/react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_SUPPLIERS } from './ProcurementForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcurementProps {
  orders: PurchaseOrder[];
  setOrders: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function Procurement({ orders, setOrders, products, setProducts }: ProcurementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { formatPrice } = useCurrency();

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const supplier = MOCK_SUPPLIERS.find(s => s.id === order.supplierId);
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.supplierId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          supplier?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleUpdateStatus = (orderId: string, newStatus: PurchaseOrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        // If status changes to RECEIVED, update inventory
        if (newStatus === PurchaseOrderStatus.RECEIVED && order.status !== PurchaseOrderStatus.RECEIVED) {
          updateInventoryFromOrder(order);
        }
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const updateInventoryFromOrder = (order: PurchaseOrder) => {
    setProducts(prevProducts => prevProducts.map(product => {
      const orderItem = order.items.find(item => item.productId === product.id);
      if (orderItem) {
        const newStock = product.currentStock + orderItem.quantity;
        let newStatus = StockStatus.IN_STOCK;
        if (newStock === 0) newStatus = StockStatus.OUT_OF_STOCK;
        else if (newStock <= product.minThreshold) newStatus = StockStatus.LOW_STOCK;
        
        return {
          ...product,
          currentStock: newStock,
          status: newStatus
        };
      }
      return product;
    }));
  };

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case PurchaseOrderStatus.RECEIVED:
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 uppercase text-[10px] tracking-wider"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case PurchaseOrderStatus.PENDING:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 uppercase text-[10px] tracking-wider"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
      case PurchaseOrderStatus.APPROVED:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 uppercase text-[10px] tracking-wider"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
      case PurchaseOrderStatus.CANCELLED:
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 uppercase text-[10px] tracking-wider"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case PurchaseOrderStatus.ORDERED:
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 uppercase text-[10px] tracking-wider"><Truck className="w-3 h-3 mr-1" /> {status}</Badge>;
      default:
        return <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100 uppercase text-[10px] tracking-wider">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Procurement Orders</h2>
          <p className="text-zinc-500 mt-1">Track and manage your purchase orders and incoming stock.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search by Order ID or Supplier..."
              className="pl-10 bg-zinc-50 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white border-zinc-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(PurchaseOrderStatus).map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50">
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Order Info</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Supplier</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Items</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Total Amount</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-zinc-50/50 transition-colors group border-b border-zinc-100"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{order.id}</p>
                        <p className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">
                          {MOCK_SUPPLIERS.find(s => s.id === order.supplierId)?.name || order.supplierId}
                        </p>
                        <p className="text-xs text-zinc-500">ID: {order.supplierId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <p className="text-sm font-medium text-zinc-900">{order.items.length} Type(s)</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-zinc-900">{formatPrice(order.totalAmount)}</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === PurchaseOrderStatus.PENDING && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-[11px] font-bold uppercase border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => handleUpdateStatus(order.id, PurchaseOrderStatus.APPROVED)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 text-[11px] font-bold uppercase border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => handleUpdateStatus(order.id, PurchaseOrderStatus.CANCELLED)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === PurchaseOrderStatus.APPROVED && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-[11px] font-bold uppercase border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                            onClick={() => handleUpdateStatus(order.id, PurchaseOrderStatus.ORDERED)}
                          >
                            Mark Ordered
                          </Button>
                        )}
                        {order.status === PurchaseOrderStatus.ORDERED && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-[11px] font-bold uppercase border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => handleUpdateStatus(order.id, PurchaseOrderStatus.RECEIVED)}
                          >
                            Mark Received
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-8 w-8 mb-2 opacity-20" />
                      No purchase orders found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
