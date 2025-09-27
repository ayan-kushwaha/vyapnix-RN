// app/catalog/add-template.tsx

import { AddTemplateModal } from '@/src/screens/Catalog/AddTemplateModal';
import { Stack } from 'expo-router';
import { useTheme } from '@/src/context/ThemeContext';

export default function AddTemplateScreen() {
  const { theme } = useTheme();

  return (
    <>
      {/* Yeh header ka style set karega */}
      <Stack.Screen 
        options={{ 
          presentation: 'modal', 
          headerShown: false, // Humne component ke andar hi title de diya hai
        }} 
      />
      <AddTemplateModal />
    </>
  );
}