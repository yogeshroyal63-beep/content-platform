import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useContent = () => {
  const [contents, setContents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/content', { params });
      setContents(res.data.data.content);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, []);

  const createContent = async (data) => {
    const res = await api.post('/content', data);
    return res.data.data.content;
  };

  const deleteContent = async (id) => {
    await api.delete(`/content/${id}`);
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  return { contents, pagination, loading, error, fetchContent, createContent, deleteContent };
};
