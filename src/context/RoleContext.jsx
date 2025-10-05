// src/context/RoleContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context create karein with default values for better TypeScript support
export const RoleContext = createContext({
  role: 'user',
  changeRole: (val) => { },
});

export const ROLE_KEY = "user_app_role";

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('user'); // Default role 'user' rakhein

  useEffect(() => {
    const loadRole = async () => {
      const savedRole = await AsyncStorage.getItem(ROLE_KEY);
      if (savedRole && ['user', 'business', ''].includes(savedRole)) {
        setRole(savedRole);
      }
    };
    loadRole();
  }, []);

  const changeRole = async (newRole) => {
    if (['user', 'business', ''].includes(newRole)) {
      setRole(newRole);
      await AsyncStorage.setItem(ROLE_KEY, newRole);
      console.log(`Role changed to: ${newRole}`); // Debugging ke liye
    }
  };

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Ek custom hook banayein
export const useRole = () => useContext(RoleContext);