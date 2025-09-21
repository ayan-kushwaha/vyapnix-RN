
// FILE: src/components/ThemeToggle.tsx
// Yeh dark/light mode badalne wala button hai.

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const iconColor = theme === 'dark' ? 'white' : 'black';
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme} 
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      <Feather 
        name={theme === 'dark' ? 'sun' : 'moon'} 
        size={24} 
        color={iconColor} 
      />
    </TouchableOpacity>
  );
};
export default ThemeToggle;