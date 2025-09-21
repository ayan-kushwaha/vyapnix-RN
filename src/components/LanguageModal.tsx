// src/components/LanguageModal.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import tw from 'twrnc';
import { CheckCircle2, X } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { languageModalData } from '../data/settingsScreenData';

export const LanguageModal = ({ isVisible, onClose }) => {
    const { theme } = useTheme();
    const { locale, setLocale } = useLanguage();
    
    // Jab modal khule, to current bhasha ko hi selected dikhayein
    const [selectedLang, setSelectedLang] = useState(locale);

    // Bhasha ke hisab se sahi text chunein
    const t = languageModalData[locale];
    const languages = [
        { code: 'en', name: t.english },
        { code: 'hi', name: t.hindi },
        { code: 'en-HI', name: t.hinglish },
    ];

    // "Continue" button dabane par bhasha ko save karein
    const handleContinue = () => {
        setLocale(selectedLang);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <Pressable
                style={tw`flex-1 justify-center items-center bg-black bg-opacity-60 p-4`}
                onPress={onClose} // Bahar click karne par modal band ho jayega
            >
                <Pressable style={[tw`w-full max-w-sm rounded-2xl p-6 shadow-xl`, { backgroundColor: theme.colors.card }]}>
                    <View style={tw`flex-row justify-between items-center mb-6`}>
                        <Text style={[tw`text-xl font-bold`, { color: theme.colors.text }]}>{t.selectLanguage}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`mb-3`}>
                        {languages.map((lang) => {
                            const isSelected = selectedLang === lang.code;
                            return (
                                <TouchableOpacity
                                    key={lang.code}
                                    onPress={() => setSelectedLang(lang.code)}
                                    style={[
                                        tw`w-full p-4 rounded-lg flex-row justify-between items-center border-2 mt-2`,
                                        { 
                                            borderColor: isSelected ? theme.colors.primary : 'transparent',
                                            backgroundColor: isSelected ? theme.colors.primary + '1A' : theme.colors.background 
                                        }
                                    ]}
                                >
                                    <Text style={[tw`font-semibold`, { color: theme.colors.text }]}>{lang.name}</Text>
                                    {isSelected && <CheckCircle2 size={22} color={theme.colors.primary} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        onPress={handleContinue}
                        style={[tw`mt-6 w-full py-3 rounded-lg text-center`, { backgroundColor: theme.colors.primary }]}
                    >
                        <Text style={tw`text-white font-bold text-base text-center`}>{t.continue}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
// 