// LocationPickerModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions, Platform } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, X } from 'lucide-react-native';
import tw from 'twrnc';
import { useTheme } from '../../context/ThemeContext'; // Apne theme context ko import karein

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (locationData: any) => void;
}

const { height, width } = Dimensions.get('window');

const LocationPickerModal = ({ visible, onClose, onLocationSelect }: LocationPickerProps) => {
  const { theme } = useTheme();
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<string>('Loading current location...');
  const [selectedLocationData, setSelectedLocationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Jab modal dikhega, current location fetch karega
  useEffect(() => {
    if (visible) {
      (async () => {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          onClose();
          return;
        }

        try {
          // Default Prayagraj, UP location if GPS fails
          let initialRegion = {
            latitude: 25.4358,
            longitude: 81.8463,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          const location = await Location.getCurrentPositionAsync({ timeout: 5000 });
          initialRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setRegion(initialRegion);
          // Initial address bhi fetch kar lein
          handleRegionChangeComplete(initialRegion);
        } catch (error) {
          console.log("Could not fetch location, defaulting.", error);
          setRegion(initialRegion);
          handleRegionChangeComplete(initialRegion);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [visible]);

  // Jab user map ko drag karke chhodega, tab naya address fetch hoga
  const handleRegionChangeComplete = async (newRegion: Region) => {
    setRegion(newRegion); // Map ki state update karein
    try {
      const { latitude, longitude } = newRegion;
      const addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (addressArray.length > 0) {
        const addr = addressArray[0];
        const formattedAddress = `${addr.name || ''}, ${addr.street || ''}, ${addr.city || ''}, ${addr.postalCode || ''}`;
        setSelectedAddress(formattedAddress);
        setSelectedLocationData({
          address: addr.name || '',
          landmark: addr.street || '',
          city: addr.city || '',
          state: addr.region || '',
          pincode: addr.postalCode || '',
          latitude,
          longitude,
        });
      }
    } catch (error) {
      setSelectedAddress('Could not find address for this location.');
    }
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLocationData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>Select Location</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={28} color={theme.colors.text as string} />
          </TouchableOpacity>
        </View>

        {isLoading || !region ? (
          <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChangeComplete={handleRegionChangeComplete}
              />
            
            <View style={styles.pinContainer}>
              <MapPin size={40} color={theme.colors.destructive as string} fill="red" />
            </View>
          </View>
        )}

        <View style={[styles.addressBox, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.addressLabel, { color: theme.colors.textSecondary }]}>SELECTED LOCATION</Text>
          <Text style={[styles.addressText, { color: theme.colors.text }]}>{selectedAddress}</Text>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleConfirm}
            disabled={!selectedLocationData}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  mapContainer: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  pinContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', marginBottom: 25 }, // Pin ko thoda upar adjust kiya
  addressBox: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  addressLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  addressText: { fontSize: 16, marginBottom: 15 },
  confirmButton: { padding: 15, borderRadius: 10, alignItems: 'center' },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default LocationPickerModal;