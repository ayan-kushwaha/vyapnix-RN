// src/store/taxService.ts
import axios from 'axios';
import { TaxRate } from './types';

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/taxes`;

const createTax = async (taxData: Partial<TaxRate>, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, taxData, config);
  return response.data;
};

const getTaxes = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const updateTax = async (taxId: string, taxData: Partial<TaxRate>, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/${taxId}`, taxData, config);
  return response.data;
};

const deleteTax = async (taxId: string, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_URL}/${taxId}`, config);
  return response.data;
};

export default {
  createTax,
  getTaxes,
  updateTax,
  deleteTax,
};
