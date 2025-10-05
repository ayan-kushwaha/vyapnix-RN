// src/screens/Catalog/ActionsModal.tsx

import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

// Har ek action (button) kaisa dikhega, uski typing
interface Action {
    title: string;
    icon: LucideIcon;
    onPress: () => void;
    isDestructive?: boolean; // Delete jaisa button laal rang ka dikhane ke liye
}

// Modal ko kya-kya props chahiye
interface ActionsModalProps {
    visible: boolean;
    onClose: () => void;
    actions: Action[];
    title?: string; // Optional title, jaise "Actions for 'T-Shirt'"
}

export const ActionsModal: React.FC<ActionsModalProps> = ({ visible, onClose, actions, title }) => {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Semi-transparent background, ispar click karne se modal band hoga */}
            <TouchableOpacity
                style={tw`flex-1 justify-end bg-black bg-opacity-50`}
                activeOpacity={1}
                onPress={onClose}
            >
                <SafeAreaView>
                    {/* Actions ki list wala container */}
                    <View style={[tw`m- rounded-t-xl `, { backgroundColor: theme.colors.card }]}>
                        {title && (
                            <Text style={[tw`p-4 text-center text-sm font-semibold`, { color: theme.colors.textSecondary, borderBottomWidth: 1, borderColor: theme.colors.border }]}>
                                {title}
                            </Text>
                        )}
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    action.onPress();
                                    onClose(); // Action perform karne ke baad modal band kar do
                                }}
                                style={[
                                    tw`flex-row items-center p-4`,
                                    // Pehle item ke alawa sabke upar border line
                                    { borderBottomWidth: index > 0 || title ? 1 : 0, borderColor: theme.colors.border }
                                ]}
                            >
                                <action.icon
                                    size={22}
                                    color={action.isDestructive ? (theme.colors.destructive as string) : (theme.colors.primary as string)}
                                />
                                <Text
                                    style={[
                                        tw`ml-4 text-lg`,
                                        { color: action.isDestructive ? (theme.colors.destructive as string) : theme.colors.text }
                                    ]}
                                >
                                    {action.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cancel button wala container */}
                    <View style={[tw`m- mt-0 `, { backgroundColor: theme.colors.card }]}>
                        <TouchableOpacity onPress={onClose} style={tw`p-4 items-center`}>
                            <Text style={[tw`text-lg font-bold`, { color: theme.colors.primary as string }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </TouchableOpacity>
        </Modal>
    );
};
// old