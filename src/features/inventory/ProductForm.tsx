/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Product, StockStatus } from '../../types';
import { useCurrency } from '@/src/lib/CurrencyContext';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  currentStock: z.number().min(0, 'Stock cannot be negative'),
  minThreshold: z.number().min(1, 'Min threshold must be at least 1'),
  unitPrice: z.number().min(0.01, 'Price must be greater than 0'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

const INITIAL_CATEGORIES = ['Electronics', 'Mechanical', 'Hardware', 'Software', 'Other'];

export default function ProductForm({ isOpen, onClose, onSubmit }: ProductFormProps) {
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const { currency } = useCurrency();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      currentStock: 0,
      minThreshold: 10,
      unitPrice: 0,
      category: 'Other'
    }
  });

  const categoryValue = watch('category');

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const formattedCategory = newCategory.trim();
      setCategories(prev => [...prev, formattedCategory]);
      setValue('category', formattedCategory);
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const onFormSubmit = (data: ProductFormData) => {
    let status = StockStatus.IN_STOCK;
    if (data.currentStock === 0) status = StockStatus.OUT_OF_STOCK;
    else if (data.currentStock <= data.minThreshold) status = StockStatus.LOW_STOCK;

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      status
    };

    onSubmit(newProduct);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details of the new product to add to your inventory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Industrial Controller" />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register('sku')} placeholder="SKU-001" />
              {errors.sku && <p className="text-xs text-rose-500">{errors.sku.message}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              </div>
              
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <Input 
                    placeholder="New category" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="h-10"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    className="h-10"
                    onClick={handleAddCategory}
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <Select 
                  value={categoryValue} 
                  onValueChange={(val) => setValue('category', val)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.category && <p className="text-xs text-rose-500">{errors.category.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentStock">Initial Stock</Label>
              <Input 
                id="currentStock" 
                type="number" 
                {...register('currentStock', { valueAsNumber: true })} 
              />
              {errors.currentStock && <p className="text-xs text-rose-500">{errors.currentStock.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minThreshold">Min Threshold</Label>
              <Input 
                id="minThreshold" 
                type="number" 
                {...register('minThreshold', { valueAsNumber: true })} 
              />
              {errors.minThreshold && <p className="text-xs text-rose-500">{errors.minThreshold.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unitPrice">Unit Price ({currency.symbol})</Label>
            <Input 
              id="unitPrice" 
              type="number" 
              step="0.01" 
              {...register('unitPrice', { valueAsNumber: true })} 
            />
            {errors.unitPrice && <p className="text-xs text-rose-500">{errors.unitPrice.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Add Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
