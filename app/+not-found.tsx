import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Frown } from 'lucide-react-native'; // Ek friendly icon add kiya

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        {/* Saare content ko animate kiya */}
        <Animated.View 
          entering={FadeInDown.duration(500)} 
          style={styles.contentContainer}
        >
          {/* 1. Icon */}
          <Frown size={80} color="#9CA3AF" />

          {/* 2. Behtar Title aur Subtitle */}
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.subtitle}>
            Sorry, the page you are looking for doesn't exist or has been moved.
          </Text>

          {/* 3. Link ko ek Button ka look diya */}
          <Link href="/home" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16, // Elements ke beech mein space
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Thoda halka text color
    textAlign: 'center',
    maxWidth: 300, // Text ko zyada failne se rokne ke liye
  },
  button: {
    marginTop: 24,
    backgroundColor: '#3B82F6', // Ek primary color
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF', // Safed text
    fontWeight: '600',
  },
});