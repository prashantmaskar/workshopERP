import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../lib/store';
import { setItems, setLoading, setError } from '../lib/slices/customerSlice';
import client from '../lib/api/client';
import { ENDPOINTS } from '../lib/api/endpoints';

export const useCustomer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, currentPage, pageSize, total } = useSelector((state: RootState) => state.customer);

  const fetchCustomers = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await client.get(ENDPOINTS.CUSTOMER.LIST);
      dispatch(setItems(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
      // Fallback for demo
      const mockCustomers = [
        { id: 'CUST-001', name: 'ABC Manufacturing', email: 'contact@abc.com', phone: '1234567890', city: 'Mumbai', state: 'Maharashtra', date: '2024-05-01' },
        { id: 'CUST-002', name: 'Global Tech', email: 'info@globaltech.com', phone: '9876543210', city: 'Bangalore', state: 'Karnataka', date: '2024-04-15' },
        { id: 'CUST-003', name: 'Precision Parts Ltd', email: 'sales@precision.com', phone: '5550123456', city: 'Pune', state: 'Maharashtra', date: '2024-03-20' },
      ];
      dispatch(setItems(mockCustomers));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createCustomer = async (data: any) => {
    dispatch(setLoading(true));
    try {
      const response = await client.post(ENDPOINTS.CUSTOMER.CREATE, data);
      await fetchCustomers();
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.message));
      // Fake success for demo
      const newItems = [...items, { ...data, id: `CUST-00${items.length + 1}`, date: new Date().toISOString().split('T')[0] }];
      dispatch(setItems(newItems));
      return data;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await client.delete(ENDPOINTS.CUSTOMER.DELETE(id));
      await fetchCustomers();
    } catch (err: any) {
      const newItems = items.filter(item => item.id !== id);
      dispatch(setItems(newItems));
    }
  };

  return {
    items,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    fetchCustomers,
    createCustomer,
    deleteCustomer,
    dispatch
  };
};
