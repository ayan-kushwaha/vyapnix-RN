// import React, { useEffect } from 'react';
// import { StatusBar, Platform } from 'react-native';
// import * as NavigationBar from 'expo-navigation-bar';
// import { useTheme } from '../context/ThemeContext';

// export function ThemedStatusBar() {
//     const { theme } = useTheme();

//     useEffect(() => {
//         if (Platform.OS === "android") {
//             try {
//                 NavigationBar.setButtonStyleAsync(theme.mode === 'dark' ? "light" : "dark");
//             } catch (e) {
//                 // Edge-to-edge mode mein error ko ignore karein
//             }
//         }
//     }, [theme.mode]);

//     return (
//         <StatusBar
//             translucent
//             backgroundColor="transparent"
//             barStyle={theme.mode === 'dark' ? "light-content" : "dark-content"}
//         />
//     );
// }
