// src/store/businessService.ts
import axios from 'axios';
import { BusinessProfile } from './types';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// const API_URL = 'http://10.152.238.74:5001/api/businesses';
const API_URL = `${API_BASE_URL}/businesses`;

// Create a new business profile
const create = async (businessData: Partial<BusinessProfile>, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, businessData, config);
  return response.data;
};

// Update an existing business profile
const update = async (businessData: Partial<BusinessProfile>, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/my-business`, businessData, config);
  return response.data;
};

// Fetch current user's business profile
const getMyBusiness = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/my-business`, config);
  return response.data;
};

const businessService = {
  create,
  update,
  getMyBusiness,
};

export default businessService;
