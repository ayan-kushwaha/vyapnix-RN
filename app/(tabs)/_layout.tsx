//app(/tabs)/_layout.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import BottomNav from '../../src/components/BottomNav';
import { Slot } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabsLayout() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Slot />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}
// 

///////////////////old