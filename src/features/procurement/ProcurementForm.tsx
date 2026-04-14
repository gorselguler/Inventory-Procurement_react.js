/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from '@/src/lib/CurrencyContext';
import { PurchaseOrderStatus, Product, Supplier, PurchaseOrder } from '../../types';

const purchaseOrderSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  supplierId: z.string().min(1, 'Supplier is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0.01, 'Price must be greater than 0'),
  expectedDeliveryDate: z.string().min(1, 'Delivery date is required'),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

interface ProcurementFormProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: PurchaseOrder) => void;
}

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S1', name: 'Global Components', contactPerson: 'John Smith', email: 'john@global.com', phone: '123-456-7890', categories: ['Electronics', 'Mechanical'] },
  { id: 'S2', name: 'Direct Hardware', contactPerson: 'Jane Doe', email: 'jane@direct.com', phone: '098-765-4321', categories: ['Hardware'] },
  { id: 'S3', name: 'Premium Supplies Co.', contactPerson: 'Robert Wilson', email: 'robert@premium.com', phone: '555-0199', categories: ['Industrial', 'Safety'] },
];

export default function ProcurementForm({ product, isOpen, onClose, onSubmit }: ProcurementFormProps) {
  const queryClient = useQueryClient();
  const { currency } = useCurrency();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
  });

  // Reset form when product changes or dialog opens
  useEffect(() => {
    if (product && isOpen) {
      const defaultSupplier = MOCK_SUPPLIERS.find(s => s.categories.includes(product.category));
      reset({
        productId: product.id,
        supplierId: defaultSupplier?.id || '',
        quantity: product.minThreshold * 2,
        unitPrice: product.unitPrice,
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
  }, [product, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: PurchaseOrderFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: `PO-${Math.floor(Math.random() * 10000)}`,
        supplierId: data.supplierId,
        items: [{
          productId: data.productId,
          quantity: data.quantity,
          unitPrice: data.unitPrice
        }],
        status: PurchaseOrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        expectedDeliveryDate: data.expectedDeliveryDate,
        totalAmount: data.quantity * data.unitPrice
      } as PurchaseOrder;
    },
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      onSubmit(newOrder); 
      reset();
      onClose();
    }
  });

  const onFormSubmit = (data: PurchaseOrderFormData) => {
    mutation.mutate(data);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Generate a new purchase order for {product.name}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product">Product</Label>
            <Input id="product" value={product.name} disabled className="bg-zinc-50" />
            <input type="hidden" {...register('productId')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Controller
              control={control}
              name="supplierId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.supplierId ? 'border-rose-500' : ''}>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_SUPPLIERS.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.supplierId && <p className="text-[10px] text-rose-500">{errors.supplierId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                {...register('quantity', { valueAsNumber: true })} 
                className={errors.quantity ? 'border-rose-500' : ''}
              />
              {errors.quantity && <p className="text-[10px] text-rose-500">{errors.quantity.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unitPrice">Unit Price ({currency.symbol})</Label>
              <Input 
                id="unitPrice" 
                type="number" 
                step="0.01" 
                {...register('unitPrice', { valueAsNumber: true })} 
                className={errors.unitPrice ? 'border-rose-500' : ''}
              />
              {errors.unitPrice && <p className="text-[10px] text-rose-500">{errors.unitPrice.message}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expectedDeliveryDate">Expected Delivery</Label>
            <Input 
              id="expectedDeliveryDate" 
              type="date" 
              {...register('expectedDeliveryDate')} 
              className={errors.expectedDeliveryDate ? 'border-rose-500' : ''}
            />
            {errors.expectedDeliveryDate && <p className="text-[10px] text-rose-500">{errors.expectedDeliveryDate.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
