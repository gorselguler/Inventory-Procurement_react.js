/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { PurchaseOrderStatus, Product, Supplier } from '../../types';

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
}

const MOCK_SUPPLIERS: Supplier[] = [];

export default function ProcurementForm({ product, isOpen, onClose }: ProcurementFormProps) {
  const queryClient = useQueryClient();
  
  // Auto-populate supplier based on product category
  const defaultSupplier = MOCK_SUPPLIERS.find(s => 
    product ? s.categories.includes(product.category) : false
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    values: product ? {
      productId: product.id,
      supplierId: defaultSupplier?.id || '',
      quantity: product.minThreshold * 2,
      unitPrice: product.unitPrice,
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    } : undefined
  });

  const mutation = useMutation({
    mutationFn: async (data: PurchaseOrderFormData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: `PO-${Math.floor(Math.random() * 1000)}`,
        ...data,
        status: PurchaseOrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        totalAmount: data.quantity * data.unitPrice
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      reset();
      onClose();
    }
  });

  const onSubmit = (data: PurchaseOrderFormData) => {
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product">Product</Label>
            <Input id="product" value={product.name} disabled className="bg-zinc-50" />
            <input type="hidden" {...register('productId')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input 
              id="supplier" 
              value={defaultSupplier?.name || 'No preferred supplier'} 
              disabled 
              className="bg-zinc-50" 
            />
            <input type="hidden" {...register('supplierId')} />
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
              <Label htmlFor="unitPrice">Unit Price ($)</Label>
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
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? 'Processing...' : 'Submit Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
