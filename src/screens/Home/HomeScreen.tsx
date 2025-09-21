import React from "react";
import { View, Text, Button } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import MobileContainer from "../../components/MobileContainer";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../context/auth-context"; // Auth ko baad mein theek karenge

export default function HomeScreen() {
	const { theme } = useTheme();
	// const { logout, user } = useAuth(); // Isko abhi ke liye comment kar rahe hain
const { setThemeMode } = useTheme();

	return (
		<MobileContainer>
			{/* Header Section */}
			<View className="flex-row justify-between items-center mb-6">
				<Text className="text-3xl font-bold" style={{ color: theme.colors.text }}>
					DropDore
				</Text>
				<ThemeToggle />
			</View>

			{/* Card Section */}
			<View
				className="p-6 rounded-lg shadow-md"
				style={{ backgroundColor: theme.colors.card }}>
				<Text className="text-xl font-semibold" style={{ color: theme.colors.text }}>
					Welcome Home!
				</Text>
				<Text className="mt-2" style={{ color: theme.colors.text }}>
					User Role: Customer {/* Abhi ke liye hardcode kiya hai */}
				</Text>
				<View className="mt-4">
					<Button title="Logout" onPress={() => alert("Logout pressed!")} />
				</View>

				<Button title="Light Mode" onPress={() => setThemeMode("light")} />
				<Button title="Dark Mode" onPress={() => setThemeMode("dark")} />
				<Button title="Custom Mode" onPress={() => setThemeMode("custom")} />
				<Button title="System Default" onPress={() => setThemeMode("system")} />
			</View>
		</MobileContainer>
	);
}
