// src/screens/Catalog/ActionsModal.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/src/context/ThemeContext';

interface Action {
  title: string;
  icon: LucideIcon;
  onPress: () => void;
  isDestructive?: boolean;
}

interface ActionsModalProps {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
  title?: string;
}

export const ActionsModal: React.FC<ActionsModalProps> = ({ visible, onClose, actions, title }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={tw`flex-1 justify-end bg-black bg-opacity-50`} activeOpacity={1} onPress={onClose}>
        <SafeAreaView>
            <View style={[tw`m-2 rounded-xl`, { backgroundColor: theme.colors.card }]}>
                {title && <Text style={[tw`p-4 text-center font-bold`, { color: theme.colors.textSecondary }]}>{title}</Text>}
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            action.onPress();
                            onClose();
                        }}
                        style={[tw`flex-row items-center p-4`, { borderTopWidth: index > 0 ? 1 : 0, borderColor: theme.colors.border }]}>
                        <action.icon size={22} color={action.isDestructive ? (theme.colors.destructive as string) : theme.colors.primary} />
                        <Text style={[tw`ml-4 text-lg`, { color: action.isDestructive ? (theme.colors.destructive as string) : theme.colors.text }]}>
                            {action.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={[tw`m-2 mt-0 rounded-xl`, { backgroundColor: theme.colors.card }]}>
                <TouchableOpacity onPress={onClose} style={tw`p-4 items-center`}>
                    <Text style={[tw`text-lg font-bold`, { color: theme.colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};