// LocationPickerModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import MapView, { Region, MapType } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, X, Layers, LocateFixed, ZoomIn, ZoomOut } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (locationData: any) => void;
}

const LocationPickerModal = ({ visible, onClose, onLocationSelect }: LocationPickerProps) => {
  const { theme } = useTheme();
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [selectedAddress, setSelectedAddress] = useState<string>('Loading current location...');
  const [selectedLocationData, setSelectedLocationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecentering, setIsRecentering] = useState(false); // Naya state current location button ke liye

  // ✨ UPGRADE 1: Map type ke liye state
  const [mapType, setMapType] = useState<MapType>('standard');

  // ✨ UPGRADE 2: Map ko control karne ke liye ref
  const mapRef = useRef<MapView>(null);

  // Jab modal dikhega, current location fetch karega
  useEffect(() => {
    if (visible) {
      goToCurrentLocation(true); // Initial load ke liye isko call karein
    }
  }, [visible]);

  // Current location fetch karne ka function (ab ye reusable hai)
  const goToCurrentLocation = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setIsLoading(true);
    } else {
      setIsRecentering(true); // Button press par alag indicator
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      onClose();
      setIsLoading(false);
      setIsRecentering(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, timeout: 6000 });
      const currentRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005, // Zyada zoom in start ke liye
        longitudeDelta: 0.005, // Isse exact point behtar dikhega
      };

      // Map ko smoothly animate karein
      mapRef.current?.animateToRegion(currentRegion, 1000); // 1 second animation
      setRegion(currentRegion);
      await handleRegionChangeComplete(currentRegion);

    } catch (error) {
      console.log("Could not fetch current location.", error);
      alert("Could not fetch your precise location. Please check your GPS settings.");
      // Fallback to Prayagraj if location fails on initial load
      if (isInitialLoad) {
        const initialRegion = {
          latitude: 25.4358,
          longitude: 81.8463,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setRegion(initialRegion);
        await handleRegionChangeComplete(initialRegion);
      }
    } finally {
      setIsLoading(false);
      setIsRecentering(false);
    }
  };

  // Jab user map ko drag karke chhodega, tab naya address fetch hoga
  const handleRegionChangeComplete = async (newRegion: Region) => {
    setRegion(newRegion);
    try {
      const { latitude, longitude } = newRegion;
      const addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (addressArray.length > 0) {
        const addr = addressArray[0];
        const landmarkPoint = [addr.name, addr.street].filter(Boolean).join(', ');
        const fullAddress = [addr.streetNumber, addr.street, addr.district, addr.city, addr.region, addr.postalCode].filter(Boolean).join(', ');
        setSelectedAddress(fullAddress);
        const city = addr.district || addr.subregion || addr.city || '';

        setSelectedLocationData({
          landmark: landmarkPoint,
          address: fullAddress,
          city: city || '',
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

  // ✨ UPGRADE 1: Map type change karne ka function
  const toggleMapType = () => {
    if (mapType === 'standard') setMapType('satellite');
    else if (mapType === 'satellite') setMapType('hybrid');
    else setMapType('standard');
  };

  // ✨ UPGRADE 3: Zoom functions
  const handleZoomIn = () => {
    if (!region) return;
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = () => {
    if (!region) return;
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    mapRef.current?.animateToRegion(newRegion, 300);
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

        {isLoading ? (
          <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef} // Ref yahan attach kiya
              style={styles.map}
              mapType={mapType} // MapType yahan set kiya
              initialRegion={region}
              onRegionChangeComplete={handleRegionChangeComplete}
              showsUserLocation={false} // Default blue dot hata diya
              showsMyLocationButton={false} // Default location button hata diya
            />

            <View style={styles.pinContainer}>
              <MapPin size={40} color={theme.colors.destructive as string} fill="red" />
            </View>

            {/* --- Naye Control Buttons --- */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity activeOpacity={0.8} style={[styles.controlButton, { backgroundColor: theme.colors.primary }]} onPress={toggleMapType}>
                <Layers size={22} color={theme.colors.text as string} />
              </TouchableOpacity>

              <TouchableOpacity  activeOpacity={0.8}  style={[styles.controlButton,{ backgroundColor: theme.colors.primary }]} onPress={() => goToCurrentLocation(false)} disabled={isRecentering}>
                {isRecentering ? <ActivityIndicator size="small" /> : <LocateFixed size={22} color={theme.colors.text as string} />}
              </TouchableOpacity>

              <View style={styles.zoomControls}>
                <TouchableOpacity  activeOpacity={0.8}  style={[styles.controlButton, styles.zoomButtonTop,{ backgroundColor: theme.colors.primary }]} onPress={handleZoomIn}>
                  <ZoomIn size={22} color={theme.colors.text as string} />
                </TouchableOpacity>
                <TouchableOpacity  activeOpacity={0.8}  style={[styles.controlButton, styles.zoomButtonBottom,{ backgroundColor: theme.colors.primary }]} onPress={handleZoomOut}>
                  <ZoomOut size={22} color={theme.colors.text as string} />
                </TouchableOpacity>
              </View>
            </View>
            {/* --- Buttons End --- */}

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

// Styles mein naye controls ke liye styling add ki gayi hai
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  mapContainer: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  pinContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  addressBox: { padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  addressLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  addressText: { fontSize: 16, marginBottom: 15 },
  confirmButton: { padding: 15, borderRadius: 10, alignItems: 'center' },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // ✨ Naye Styles
  controlsContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  zoomControls: {
    flexDirection: 'column',
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden', // to get sharp edges between zoom buttons
    elevation: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  zoomButtonTop: {
    marginBottom: 0,
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  zoomButtonBottom: {
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 0,
  },
});

export default LocationPickerModal;