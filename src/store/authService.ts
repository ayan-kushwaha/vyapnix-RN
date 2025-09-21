
// authService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterUserData, LoginUserData, UpdateUserData } from './types';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// const API_URL = 'http://10.152.238.74:5001/api/users';
const API_URL = `${API_BASE_URL}/users`;

// Register user
const register = async (userData: RegisterUserData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Login user
const login = async (userData: LoginUserData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
    console.log("LOGIN RESPONSE:", response.data); // Debug here

  if (response.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Get current user's full profile data
const getMe = async (token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // Note: GET request still uses /profile as per most API designs
  // const response = await axios.get(`${API_URL}/updateUser`, config); 
    const response = await axios.get(`${API_URL}/profile`, config);

  if (response.data) {
    const updatedUser = { ...response.data, token };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

// Update user's personal details
const updateProfile = async (userData: UpdateUserData, token: string) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  // ✅ FIX: URL ko Postman collection ke anusaar /updateUser kar diya gaya hai
  const response = await axios.put(`${API_URL}/updateUser`, userData, config); 
  return response.data;
};

// Logout user
const logout = async () => {
  await AsyncStorage.removeItem('user');
  await AsyncStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
};

export default authService;

