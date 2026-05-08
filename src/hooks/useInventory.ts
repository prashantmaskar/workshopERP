import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { setItems, setLoading, setError } from '../lib/slices/inventorySlice';
import client from '../lib/api/client';
import { ENDPOINTS } from '../lib/api/endpoints';

export const useInventory = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.inventory);

  const fetchInventory = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await client.get(ENDPOINTS.INVENTORY.LIST);
      dispatch(setItems(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
      // Fallback
      const mock = [
        { id: '1', sku: 'SKU-001', name: 'Stainless Steel Rod', quantity: 450, warehouse: 'Warehouse A', price: '₹450', status: 'In Stock' },
        { id: '2', sku: 'SKU-002', name: 'Aluminum Plate', quantity: 12, warehouse: 'Warehouse B', price: '₹1,200', status: 'Low Stock' },
      ];
      dispatch(setItems(mock));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { items, loading, error, fetchInventory };
};
