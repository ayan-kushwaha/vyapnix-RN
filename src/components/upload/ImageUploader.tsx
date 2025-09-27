import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import { Plus, X } from 'lucide-react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { uploadImageToCloudinary } from '@/src/utils/cloudinary'; // Maan kar chal rahe hain ki yeh file hai

interface ImageUploaderProps {
  initialImages?: string[];
  onImagesChanged: (images: string[]) => void; // Parent ko images ki list bhejega
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ initialImages = [], onImagesChanged }) => {
    const { theme } = useTheme();
    const [images, setImages] = useState<string[]>(initialImages);
    const [isUploading, setIsUploading] = useState(false);

    // Jab parent se initialImages badle, to state update karein
    useEffect(() => {
        setImages(initialImages);
    }, [initialImages]);

    const pickImage = async () => {
        if (isUploading) return;
        
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            // quality: 0.7,
        });

        if (!result.canceled) {
            handleUpload(result.assets[0].uri);
        }
    };

    const handleUpload = async (uri: string) => {
        setIsUploading(true);
        try {
            const uploadedData = await uploadImageToCloudinary(uri, () => {}); // Progress yahan handle nahi kar rahe
            const newImages = [...images, uploadedData.url];
            setImages(newImages);
            onImagesChanged(newImages); // Parent ko update bhejein
        } catch (err) {
            console.error("Upload failed!", err);
            Alert.alert("Upload Failed", "Could not upload the image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDeleteImage = (indexToRemove: number) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
        onImagesChanged(newImages); // Parent ko update bhejein
    };

    return (
        <View style={tw`mb-4`}>
            <Text style={[tw`text-sm font-medium mb-2`, { color: theme.colors.textSecondary }]}>Item Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* Saari images dikhane ke liye */}
                {images.map((url, index) => (
                    <View key={index} style={tw`relative w-24 h-24 mr-2 rounded-lg`}>
                        <Image source={{ uri: url }} style={tw`w-full h-full rounded-lg`} />
                        <TouchableOpacity 
                            onPress={() => handleDeleteImage(index)}
                            style={tw`absolute top-1 right-1 bg-red-500 rounded-full p-1`}
                        >
                            <X size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Nayi image add karne ka button */}
                <TouchableOpacity 
                    onPress={pickImage} 
                    disabled={isUploading}
                    style={[tw`w-24 h-24 rounded-lg items-center justify-center border-2 border-dashed`, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                >
                    {isUploading ? <ActivityIndicator color={theme.colors.primary as string} /> : <Plus size={24} color={theme.colors.textSecondary as string} />}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};