// app(/tabs)/_layout.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import BottomNav from '../../src/components/BottomNav';
import { Slot } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { TabBarProvider } from '../../src/context/TabBarContext';

export default function TabsLayout() {
  return (
    <TabBarProvider>
      <TabsLayoutContent />
    </TabBarProvider>
  );
}

function TabsLayoutContent() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Slot />
      <BottomNav />
    </View>
  );
}
