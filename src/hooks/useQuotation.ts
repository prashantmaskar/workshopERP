import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../lib/store';
import { setItems, setLoading, setError } from '../lib/slices/quotationSlice';
import client from '../lib/api/client';
import { ENDPOINTS } from '../lib/api/endpoints';

export const useQuotation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, currentPage, pageSize, total } = useSelector((state: RootState) => state.quotation);

  const fetchQuotations = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await client.get(ENDPOINTS.QUOTATION.LIST);
      dispatch(setItems(response.data));
    } catch (err: any) {
      dispatch(setError(err.message));
      // Fallback for demo
      const mockQuotes = [
        { id: '1', quoteNo: 'PI/QTN/2026/0001', customer: 'ABC Manufacturing', attainedBy: 'John Admin', partName: 'Engine Valve', date: '2026-05-01', total: '12,450' },
        { id: '2', quoteNo: 'PI/QTN/2026/0002', customer: 'Global Tech', attainedBy: 'Sarah Staff', partName: 'Cylinder Block', date: '2026-05-04', total: '45,000' },
        { id: '3', quoteNo: 'PI/QTN/2026/0003', customer: 'Precision Parts', attainedBy: 'John Admin', partName: 'Gear Shaft', date: '2026-05-05', total: '8,320' },
      ];
      dispatch(setItems(mockQuotes));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const createQuotation = async (data: any) => {
    dispatch(setLoading(true));
    try {
      const response = await client.post(ENDPOINTS.QUOTATION.CREATE, data);
      await fetchQuotations();
      return response.data;
    } catch (err: any) {
      const newItems = [...items, { ...data, id: String(items.length + 1), date: new Date().toISOString().split('T')[0] }];
      dispatch(setItems(newItems));
      return data;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    items,
    loading,
    error,
    fetchQuotations,
    createQuotation
  };
};
