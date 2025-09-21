// FILE: src/components/MobileContainer.tsx
// Yeh har screen ke liye ek safe aur themed background dega.

import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MobileContainer = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1, padding: 16 }}>{children}</View>
    </SafeAreaView>
  );
};
export default MobileContainer;