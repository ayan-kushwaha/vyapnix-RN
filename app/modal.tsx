// FILE: app/modal.tsx
// Yeh humari nayi modal screen hai, NativeWind aur custom theme ke saath.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MobileContainer from '../src/components/MobileContainer'; // Humara reusable component
import { useTheme } from '../src/context/ThemeContext'; // Humari custom theme

export default function ModalScreen() {
  const { theme } = useTheme();

  return (
    <MobileContainer>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold" style={{ color: theme.colors.text }}>
          Modal Screen
        </Text>
        <View className="my-7 h-px w-4/5 bg-gray-200" />
        <Text style={{ color: theme.colors.text }}>
          Yeh humari modal screen hai.
        </Text>
      </View>
    </MobileContainer>
  );
}
