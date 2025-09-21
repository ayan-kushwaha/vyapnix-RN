import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 10 },
};

interface Theme {
  mode: 'light' | 'dark';
  colors: { primary: string; secondary: string; background: string; card: string; text: string; textSecondary: string; border: string; tabBar: string; tabBarActive: string; tabBarInactive: string; iconColor: string; destructive: String };
  gradients: { background: string[]; card: string[]; primaryButton: string[]; };
  shadows: typeof shadows;
}

export const lightTheme: Theme = {
  mode: 'light',
  colors: { primary: '#3B82F6', secondary: '#10B981', background: '#F3F4F6', card: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', border: '#E5E7EB', tabBar: '#FFFFFF', tabBarActive: '#3B82F6', tabBarInactive: '#6B7280', iconColor: '#000',destructive: "#FF4B4B",  },
  gradients: { background: ['#FFFFFF', '#F3F4F6'], card: ['#FFFFFF', '#FFFFFF'], primaryButton: ['#60A5FA', '#3B82F6'] },
  shadows,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: { primary: '#818CF8', secondary: '#34D399', background: '#111827', card: '#1F2937', text: '#FFFFFF', textSecondary: '#9CA3AF', border: '#374151', tabBar: '#1F2937', tabBarActive: '#818CF8', tabBarInactive: '#9CA3AF', iconColor: '#FFFFFF',destructive: "#FF4B4B",  },
  gradients: { background: ['#111827', '#10111A'], card: ['#2A334B', '#1F2937'], primaryButton: ['#818CF8', '#60A5FA'] },
  shadows: { ...shadows, md: { ...shadows.md, shadowColor: '#818CF8', shadowOpacity: 0.3, elevation: 5 } },
};
// -------------------------------------------------------------------

interface CustomColors {
  primary: string;
  gradientStart: string;
  gradientEnd: string;
}

type ThemeMode = 'light' | 'dark' | 'custom' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useColorScheme() ?? 'light';
  const [isLoading, setIsLoading] = useState(true);
  const [themeMode, _setThemeMode] = useState<ThemeMode>('system');
  
  // ✨ नया बदलाव: कस्टम थीम के लिए बेस (light/dark) को स्टोर करें
  const [customThemeBase, setCustomThemeBase] = useState<'light' | 'dark'>('dark');

  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#F59E0B',
    gradientStart: '#FBBF24',
    gradientEnd: '#F59E0B',
  });
  const [activeTheme, setActiveTheme] = useState(systemTheme === 'dark' ? darkTheme : lightTheme);

  // ✨ नया बदलाव: थीम मोड सेट करते समय बेस को भी सेट करने वाला लॉजिक
  const setThemeMode = (mode: ThemeMode) => {
    // अगर हम light या dark से custom पर जा रहे हैं, तो बेस को सेट करें
    if ((themeMode === 'light' || themeMode === 'dark') && mode === 'custom') {
      setCustomThemeBase(themeMode);
    }
    // अगर हम system से custom पर जा रहे हैं, तो सिस्टम की वर्तमान थीम को बेस बनाएं
    else if (themeMode === 'system' && mode === 'custom') {
      setCustomThemeBase(systemTheme);
    }
    _setThemeMode(mode);
  };
  
  // 1. ऐप शुरू होने पर AsyncStorage से सेटिंग्स लोड करें
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('themeSettings');
        if (savedSettings) {
          const { mode, colors, base } = JSON.parse(savedSettings);
          _setThemeMode(mode);
          if (colors) setCustomColors(colors);
          if (base) setCustomThemeBase(base); // ✨ बेस को भी लोड करें
        }
      } catch (e) {
        console.error("Failed to load theme settings.", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadThemeSettings();
  }, []);

  // 2. जब भी थीम मोड या रंग बदलें, तो AsyncStorage में सेव करें
  useEffect(() => {
    const saveThemeSettings = async () => {
        if (!isLoading) {
            try {
                // ✨ बेस को भी सेव करें
                const settings = JSON.stringify({ mode: themeMode, colors: customColors, base: customThemeBase });
                await AsyncStorage.setItem('themeSettings', settings);
            } catch (e) {
                console.error("Failed to save theme settings.", e);
            }
        }
    };
    saveThemeSettings();
  }, [themeMode, customColors, customThemeBase, isLoading]);

  // 3. activeTheme को सही ढंग से सेट करें
  useEffect(() => {
    let currentTheme: Theme;
    if (themeMode === 'system') {
      currentTheme = systemTheme === 'dark' ? darkTheme : lightTheme;
    } else if (themeMode === 'light') {
      currentTheme = lightTheme;
    } else if (themeMode === 'dark') {
      currentTheme = darkTheme;
    } else { // 'custom' mode
      // ✨ नया बदलाव: कस्टम थीम का आधार `customThemeBase` से तय होगा
      const baseTheme = customThemeBase === 'light' ? lightTheme : darkTheme;
      
      currentTheme = {
        ...baseTheme,
        mode: baseTheme.mode, // मोड को बेस से बनाए रखें
        colors: {
          ...baseTheme.colors,
          primary: customColors.primary,
          tabBarActive: customColors.primary,
        },
        gradients: {
          ...baseTheme.gradients,
          primaryButton: [customColors.gradientStart, customColors.gradientEnd],
        },
      };
    }
    setActiveTheme(currentTheme);

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        setActiveTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    });

    return () => subscription.remove();
  }, [themeMode, systemTheme, customColors, customThemeBase]);

  if (isLoading) {
    return null;
  }
  
  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode, setThemeMode, customColors, setCustomColors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};