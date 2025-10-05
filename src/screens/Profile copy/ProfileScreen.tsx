
// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';


import UserProfilePage from './UserProfilePage';
import BusinessProfilePage from './BusinessProfilePage';
// import EmployeeProfilePage from './EmployeeProfilePage'; // Future ke liye

import ProfileForm from '../../components/forms/ProfileForm';
import { useRole } from '@/src/context/RoleContext';
import { fetchMyBusiness } from '@/src/store/businessSlice';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { useTheme } from '@/src/context/ThemeContext';

export default function ProfileScreen() {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const { role } = useRole(); // Context se current viewing role lein
    const { user } = useAppSelector(state => state.auth);
    const { business, isLoading: isBusinessLoading } = useAppSelector(state => state.business);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    // Jab role switch ho, to zaroorat padne par data fetch karein
    useEffect(() => {
        if (role === 'business' && user?.role === 'business' && !business) {
            dispatch(fetchMyBusiness());
        }
    }, [role, user, business, dispatch]);

    const handleCloseModal = () => setEditModalVisible(false);

    const renderProfilePage = () => {
        const props = {
            onEditProfilePress: () => setEditModalVisible(true),
            // UserProfilePage ko Settings ke liye onSettingsPress chahiye
            onSettingsPress: () => { /* Logic to navigate to settings, preferably from a shared header */ }
        };

        switch (role) {
            case 'business':
                // Jab tak business data load na ho, loader dikhayein
                if (isBusinessLoading) {
                    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color={theme.colors.primary} />;
                }
                return <BusinessProfilePage {...props} />;

            case 'employee':
                // Employee page ka logic yahan aayega
                return <UserProfilePage {...props} />; // Abhi ke liye User page

            case 'user':
            default:
                return <UserProfilePage {...props} />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Profile Page role ke hisaab se render hoga */}
            {renderProfilePage()}

            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <ProfileForm
                    mode="edit"
                    onSuccess={handleCloseModal}
                    onClose={handleCloseModal}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
// old