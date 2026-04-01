/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unitPrice: number;
  status: StockStatus;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  categories: string[];
}

export enum PurchaseOrderStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  ORDERED = 'Ordered',
  RECEIVED = 'Received',
  CANCELLED = 'Cancelled',
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdAt: string;
  expectedDeliveryDate: string;
}
