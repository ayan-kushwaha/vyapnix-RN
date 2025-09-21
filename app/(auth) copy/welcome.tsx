// app/(auth)/welcome.tsx

import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, Dimensions, TouchableOpacity, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';
import { authScreenData } from '../../src/data/authScreenData';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Extrapolate, interpolate } from 'react-native-reanimated';
import { useAuth } from '../../src/context/AuthContext';
const { width, height } = Dimensions.get('window');
import { Image } from 'expo-image';
// Re-usable Slide Item Component
const SlideItem = ({ item }: { item: { image: string, title: string, description: string } }) => {
    const { theme } = useTheme();
    return (
        <View style={{ width }} className="items-center justify-center px-8">
             <Image 
                source={{ uri: item.image }} 
                style={tw`w-90 h-90 rounded-3xl mb-12`}
                contentFit="cover" // Controls how the image fits
                transition={500}   // Adds a nice fade-in effect
            />
            <Text style={[tw`text-3xl font-bold text-center mb-4`, { color: theme.colors.text }]}>
                {item.title}
            </Text>
            <Text style={[tw`text-center  px-6   text-base`, { color: theme.colors.textSecondary, lineHeight: 27,letterSpacing: 1.1 }]}>
                {item.description}
            </Text>
        </View>
    );
};

// Paginator component for animated dots
const Paginator = ({ data, currentIndex }: { data: any[], currentIndex: number }) => {
    const { theme } = useTheme();
    return (
        <View style={tw`flex-row h-10`}>
            {data.map((_, i) => {
                const isActive = i === currentIndex;
                const animatedStyle = useAnimatedStyle(() => {
                    return {
                        width: withTiming(isActive ? 24 : 8, { duration: 300 }),
                        backgroundColor: withTiming(isActive ? theme.colors.primary : theme.colors.border, { duration: 300 }),
                    };
                });
                return <Animated.View key={i.toString()} style={[tw`h-2 rounded-full mx-1`, animatedStyle]} />;
            })}
        </View>
    );
};

export default function WelcomeScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const { completeOnboarding } = useAuth();
    
    // FIX IS HERE: Fallback to 'en' if locale is not found
    // const t = (authScreenData[locale as 'en' | 'hi' | 'en-HI'] || authScreenData.en).welcome;
const t = (authScreenData[locale as 'en' | 'hi' | 'en-HI'] || authScreenData.en).welcome;
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;
    
    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    const handleNext = async () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < t.slides.length) {
            flatListRef.current?.scrollToIndex({ index: nextIndex });
        } else {
              await completeOnboarding();
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = async () => {
         await completeOnboarding();
        router.replace('/(auth)/login');
    };

    const isLastSlide = currentIndex === t.slides.length - 1;

    return (
        <SafeAreaView style={[tw`flex-1  pt-14`, { backgroundColor: theme.colors.background }]}>
            <LinearGradient colors={['#00000000', theme.colors.background]} style={tw`absolute bottom-0 h-1/4 w-full`} />
            <LinearGradient colors={[theme.colors.primary + '20', theme.colors.background]} style={tw`absolute inset-0`} />
            
            <FlatList
                ref={flatListRef}
                data={t.slides}
                renderItem={({ item }) => <SlideItem item={item} />}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                style={{ flex: -1 }}
            />

            <View style={tw`px-6 pb-6 pt-20 `}>
                <View style={tw`flex-row justify-between items-center`}>
                    <TouchableOpacity onPress={handleSkip} style={tw`p-2`}>
                        <Text style={[tw`text-lg`, { color: theme.colors.textSecondary }]}>
                            {isLastSlide ? '' : t.skip}
                        </Text>
                    </TouchableOpacity>

                    <Paginator data={t.slides} currentIndex={currentIndex} />

                    <TouchableOpacity
                        onPress={handleNext}
                        style={[
                            tw`w-16 h-16 rounded-full items-center justify-center transition-all`,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        {isLastSlide ? (
                            <Text style={tw`text-white font-bold text-sm`}>Start</Text>
                        ) : (
                            <ArrowRight size={24} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

// 