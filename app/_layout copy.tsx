import "../global.css";
import "react-native-gesture-handler";

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import ThemeProvider, { useTheme } from "../src/context/ThemeContext";
import { RoleProvider } from "../src/context/RoleContext";
import { StatusBar, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { LanguageProvider } from '../src/context/LanguageContext';
export default function RootLayout() {
	return (
		<ThemeProvider>
			<RoleProvider>
				<LanguageProvider>
					<ThemedStatusBar />
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" />
					</Stack>
				</LanguageProvider>
			</RoleProvider>
		</ThemeProvider>
	);
}

function ThemedStatusBar() {
	const { theme } = useTheme();

	useEffect(() => {
		if (Platform.OS === "android") {
			// 👇 Navigation bar transparent + icons auto theme ke hisaab se
			NavigationBar.setBackgroundColorAsync("transparent");
			NavigationBar.setButtonStyleAsync(theme.mode ? "light" : "dark");
		}
	}, [theme.mode]);

	return (
		<StatusBar
			translucent
			backgroundColor="transparent"
			barStyle={theme.mode ? "light-content" : "dark-content"}
		/>
	);
}
