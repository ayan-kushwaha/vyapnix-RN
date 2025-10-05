// src/context/RoleContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const RoleContext = createContext();

// ✅ fix: ek hi key use kar
export const ROLE_KEY = "user_app_role";
// export const ROLE_KEY = "APP_ROLE";

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("User");

  // Initial load
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(ROLE_KEY);
      if (saved) setRole(saved);
    })();
  }, []);

  // Change + persist role
  const changeRole = async (val) => {
    setRole(val);
    await AsyncStorage.setItem(ROLE_KEY, val);
  };

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  );
};
//