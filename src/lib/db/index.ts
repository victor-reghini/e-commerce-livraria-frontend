import Dexie, { type EntityTable } from 'dexie';

export interface LocalCatalogItem {
  id: string; // skuId or id
  productId: string;
  title: string;
  sku: string;
  ean?: string;
  isbn?: string;
  price: number;
  stock: number;
  coverUrl?: string;
  updatedAt: string;
}

export interface LocalCashShift {
  id: string;
  companyId: string;
  operatorId: string;
  operatorName: string;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  currentCash: number;
  status: 'OPEN' | 'CLOSED';
}

export interface LocalOfflineSale {
  id: string;
  clientUuid: string; // UUID v4 único para idempotência
  companyId: string;
  shiftId: string;
  operatorId: string;
  createdAt: string;
  items: Array<{
    skuId: string;
    skuCode: string;
    title: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  payments: Array<{
    method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
    amount: number;
  }>;
  totalAmount: number;
  changeAmount?: number;
  synced: boolean;
  syncedAt?: string;
}

export interface LocalSyncQueueItem {
  id?: number;
  type: 'SALE' | 'SUPPLY' | 'BLEED' | 'AUDIT_SCAN';
  payload: Record<string, unknown>;
  createdAt: string;
  retries: number;
  lastError?: string;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'COMPLETED';
}

class PdvDatabase extends Dexie {
  catalog!: EntityTable<LocalCatalogItem, 'id'>;
  cashShifts!: EntityTable<LocalCashShift, 'id'>;
  offlineSales!: EntityTable<LocalOfflineSale, 'id'>;
  syncQueue!: EntityTable<LocalSyncQueueItem, 'id'>;

  constructor() {
    super('PdvOfflineDb');
    this.version(1).stores({
      catalog: 'id, sku, ean, isbn, title, updatedAt',
      cashShifts: 'id, companyId, operatorId, status, openedAt',
      offlineSales: 'id, clientUuid, companyId, shiftId, synced, createdAt',
      syncQueue: '++id, type, status, createdAt',
    });
  }
}

export const pdvDb = new PdvDatabase();

