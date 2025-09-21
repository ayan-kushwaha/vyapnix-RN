// ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useAppSelector } from '../../store/hooks';

// Import your profile display components
import UserProfilePage from './UserProfilePage';
// Note: You would create a similar component for the business view
// import BusinessProfilePage from './BusinessProfilePage'; 

// Import the reusable form component we created
import ProfileForm from '../../components/forms/ProfileForm';

export default function ProfileScreen() {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const { user } = useAppSelector((state) => state.auth);
    console.log("--- ProfileScreen ---");

    /**
     * Closes the edit modal. This function is used for both successful
     * updates and manual closing actions (like pressing the back arrow).
     */
    const handleCloseModal = () => {
        setEditModalVisible(false);
    };

    // This logic determines which profile page to display.
    // For now, it defaults to UserProfilePage. You can later create and
    // swap in a BusinessProfilePage for a different layout.
    const ProfileDisplayComponent = UserProfilePage;

    return (
        <View style={styles.container}>
            <ProfileDisplayComponent 
                onEditProfilePress={() => setEditModalVisible(true)} 
            />

            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                // This handles the Android hardware back button press
                onRequestClose={handleCloseModal} 
            >
                <ProfileForm 
                    mode="edit" 
                    onSuccess={handleCloseModal}
                    // This is for the back arrow inside the form component
                    onClose={handleCloseModal} 
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

