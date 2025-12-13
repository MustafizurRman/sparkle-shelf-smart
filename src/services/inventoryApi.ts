const API_BASE_URL = 'http://localhost:5000/api';

export interface InventoryItem {
  _id?: string;
  name: string;
  brand?: string;
  category: string;
  sku?: string;
  quantity: number;
  min_stock_level?: number;
  unit_price: number;
  total_value?: number;
  createdAt?: string;
  updatedAt?: string;
}

// GET all items
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await fetch(`${API_BASE_URL}/inventory`);
  if (!response.ok) {
    throw new Error('Failed to fetch inventory items');
  }
  return response.json();
};

// GET single item
export const fetchInventoryItem = async (id: string): Promise<InventoryItem> => {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch inventory item');
  }
  return response.json();
};

// POST create new item
export const createInventoryItem = async (item: Omit<InventoryItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> => {
  const response = await fetch(`${API_BASE_URL}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create inventory item');
  }
  return response.json();
};

// PUT update item
export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update inventory item');
  }
  return response.json();
};

// DELETE item
export const deleteInventoryItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete inventory item');
  }
};
