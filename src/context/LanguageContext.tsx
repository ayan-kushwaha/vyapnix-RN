// src/context/languageContactx.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_STORAGE_KEY = "@app_language";

// Ek default state banayenge taaki context kabhi 'null' na ho
const defaultState = {
    locale: 'en',
    setLocale: (lang: string) => {}, // Khali function
    isLoading: true, // Loading state
};

const LanguageContext = createContext(defaultState);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState('en');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLang = await AsyncStorage.getItem(LANG_STORAGE_KEY);
                if (storedLang) {
                    setLocale(storedLang);
                }
            } catch (e) {
                console.error("Bhasha load nahi ho paayi.", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = async (langCode: string) => {
        try {
            await AsyncStorage.setItem(LANG_STORAGE_KEY, langCode);
            setLocale(langCode);
        } catch (e) {
            console.error("Bhasha save nahi ho paayi.", e);
        }
    };
    
    const value = { locale, setLocale: changeLanguage, isLoading };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

// 