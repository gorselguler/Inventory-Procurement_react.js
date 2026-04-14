/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Filter, Plus, MoreVertical, Package, AlertTriangle, CheckCircle2, Pencil, ShoppingCart } from 'lucide-react';
import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { StockStatus, Product } from '../../types';
import { motion } from 'motion/react';
import { useCurrency } from '@/src/lib/CurrencyContext';
import ProcurementForm from '../procurement/ProcurementForm';
import ProductForm from './ProductForm';

// Shadcn UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const INITIAL_PRODUCTS: Product[] = [];

interface InventoryProps {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  setOrders: Dispatch<SetStateAction<PurchaseOrder[]>>;
}

export default function Inventory({ products, setProducts, setOrders }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [procurementProduct, setProcurementProduct] = useState<Product | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [isProcurementOpen, setIsProcurementOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateStock = () => {
    if (!editingProduct) return;

    setProducts(prev => prev.map(p => {
      if (p.id === editingProduct.id) {
        let newStatus = StockStatus.IN_STOCK;
        if (newStockValue === 0) newStatus = StockStatus.OUT_OF_STOCK;
        else if (newStockValue <= p.minThreshold) newStatus = StockStatus.LOW_STOCK;

        return {
          ...p,
          currentStock: newStockValue,
          status: newStatus
        };
      }
      return p;
    }));
    setEditingProduct(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Inventory Management</h2>
          <p className="text-zinc-500 mt-1">Monitor and manage your product stock levels and thresholds.</p>
        </div>
        <Button 
          onClick={() => setIsAddProductOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </header>

      <ProductForm 
        isOpen={isAddProductOpen} 
        onClose={() => setIsAddProductOpen(false)} 
        onSubmit={handleAddProduct} 
      />

      <ProcurementForm
        product={procurementProduct}
        isOpen={isProcurementOpen}
        onClose={() => {
          setIsProcurementOpen(false);
          setProcurementProduct(null);
        }}
        onSubmit={(newOrder) => setOrders(prev => [newOrder, ...prev])}
      />

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search by name, SKU, or category..."
              className="pl-10 bg-zinc-50 border-zinc-200 focus:ring-orange-500/20 focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] bg-white border-zinc-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50">
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Product Details</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Stock Level</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Status</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Unit Price</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  const isLowStock = product.currentStock <= product.minThreshold;
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-zinc-50/50 transition-colors group border-b border-zinc-100 ${isLowStock ? 'bg-rose-50/30' : ''}`}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-500">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{product.name}</p>
                            <p className="text-xs text-zinc-500">SKU: {product.sku} • {product.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <p className="text-sm font-bold text-zinc-900">{product.currentStock}</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Min: {product.minThreshold}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge variant={product.status === StockStatus.IN_STOCK ? 'default' : 'destructive'} className={`uppercase text-[10px] tracking-wider ${
                          product.status === StockStatus.IN_STOCK ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
                          product.status === StockStatus.LOW_STOCK ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                          'bg-rose-100 text-rose-700 hover:bg-rose-100'
                        }`}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-zinc-900">{formatPrice(product.unitPrice)}</p>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => {
                            if (open) {
                              setEditingProduct(product);
                              setNewStockValue(product.currentStock);
                            } else {
                              setEditingProduct(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-400 hover:text-orange-500">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Update Stock</DialogTitle>
                                <DialogDescription>
                                  Adjust current stock level for {product.name}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="stock" className="text-right">
                                    Stock
                                  </Label>
                                  <Input
                                    id="stock"
                                    type="number"
                                    value={newStockValue}
                                    onChange={(e) => setNewStockValue(parseInt(e.target.value) || 0)}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleUpdateStock} className="bg-orange-500 hover:bg-orange-600">Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {product.status !== StockStatus.IN_STOCK && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-zinc-400 hover:text-orange-500"
                              onClick={() => {
                                setProcurementProduct(product);
                                setIsProcurementOpen(true);
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Package size={40} strokeWidth={1.5} />
                      <p className="text-sm font-medium">No products found in inventory</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ProcurementForm 
          product={procurementProduct} 
          isOpen={isProcurementOpen} 
          onClose={() => setIsProcurementOpen(false)} 
        />



        <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-500 font-medium">Showing {filteredProducts.length} products</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs font-bold">Previous</Button>
            <Button variant="outline" size="sm" disabled className="text-xs font-bold">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

