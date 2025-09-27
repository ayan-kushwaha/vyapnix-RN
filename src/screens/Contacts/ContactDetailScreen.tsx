import React, { FC, useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { ArrowLeft, MoreVertical, Phone, MessageSquare, IndianRupee, Briefcase, Users, MapPin, Edit, Heart } from 'lucide-react-native';
import tw from 'twrnc';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getContactDetails } from '../../store/contactSlice';

// --- Reusable Helper Components (from your reference) ---
const InfoCard: FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => { /* ... (Your InfoCard code) ... */ };
const HisabKitab: FC<{ transactions: any[]; t: any; }> = ({ transactions, t }) => { /* ... (Your HisabKitab code) ... */ };
// ... (Add other helper components like EmployeeDashboard, etc. here if needed)

export default function ContactDetailScreen() {
    const router = useRouter();
    const { contactId } = useLocalSearchParams();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();

    const { currentContact, isLoading, isError, message } = useAppSelector((state) => state.contacts);
    const contactUser = currentContact?.contactUser; // The user profile of the contact
    const businessProfile = contactUser?.businessProfile; // Their business profile

    useEffect(() => {
        if (contactId) {
            dispatch(getContactDetails(contactId as string));
        }
    }, [contactId, dispatch]);

    if (isLoading || !currentContact || !contactUser) {
        return <SafeAreaView style={[tw`flex-1 justify-center items-center`, { backgroundColor: theme.colors.background }]}><ActivityIndicator size="large" color={theme.colors.primary} /></SafeAreaView>;
    }
    
    const roleTagStyle = { client: tw`bg-blue-500/20 text-blue-500`, business: tw`bg-green-500/20 text-green-500`, employee: tw`bg-purple-500/20 text-purple-500`, user: tw`bg-gray-500/20 text-gray-500` }[currentContact.role];

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
            {/* Header Buttons */}
            <View style={tw`absolute top-12 left-0 right-0 z-10 flex-row justify-between px-4`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`p-2 rounded-full bg-black/30`}><ArrowLeft size={24} color="white" /></TouchableOpacity>
                <TouchableOpacity style={tw`p-2 rounded-full bg-black/30`}><MoreVertical size={24} color="white" /></TouchableOpacity>
            </View>

            <ScrollView>
                {/* Profile Header */}
                <ImageBackground source={{ uri: businessProfile?.logoUrl || 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?q=80&w=2070&auto=format&fit=crop' }} style={tw`h-36 w-full justify-end`}>
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={tw`absolute inset-0`} />
                </ImageBackground>
                <View style={tw`-mt-14 items-center px-4`}>
                    <Image source={{ uri: contactUser.avatarUrl }} style={[tw`w-28 h-28 rounded-full border-4`, { borderColor: theme.colors.background }]} />
                    <Text style={[tw`text-2xl font-bold mt-2 text-center`, { color: theme.colors.text }]}>{contactUser.fullName}</Text>
                    <Text style={[tw`text-base mt-1`, { color: theme.colors.textSecondary }]}>{contactUser.phone}</Text>
                    <View style={tw`mt-2`}><Text style={[tw`text-xs font-bold capitalize py-1 px-3 rounded-full`, roleTagStyle]}>{currentContact.role}</Text></View>
                </View>

                {/* ✨ NEW Hisab Kitab (Ledger) for all contacts with transactions */}
                {currentContact.transactions && currentContact.transactions.length > 0 && 
                    <HisabKitab transactions={currentContact.transactions} t={{}} /> // Pass translations here
                }

                {/* Role-specific Dashboards */}
                {currentContact.role === 'business' && businessProfile && (
                    <InfoCard title="Business Info">
                      <Text style={{color: theme.colors.text}}>Name: {businessProfile.name}</Text>
                      <Text style={{color: theme.colors.text}}>Category: {businessProfile.category}</Text>
                    </InfoCard>
                )}
                {/* Add more role-specific views here as needed */}
            </ScrollView>
        </SafeAreaView>
    );
}