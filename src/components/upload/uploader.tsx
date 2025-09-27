// srccomponents/upload/uploader
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Camera } from 'lucide-react-native';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker'; 
import * as Progress from 'react-native-progress';
import { uploadImageToCloudinary } from '@/src/utils/cloudinary';

type Props = {
    avatarUrl?: string; // Yeh prop ab bhi network URL ke liye hai
    onUploadComplete: (data: { url: string }) => void;
};

export const UploadFile: React.FC<Props> = ({ avatarUrl, onUploadComplete }) => {
    const [localUri, setLocalUri] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const pickImage = async () => {
        if (uploading) return;

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            // ✅ ERROR FIX: 'Images' ko lowercase 'images' kar diya gaya hai.
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setLocalUri(uri);
            handleUpload(uri);
        }
    };

    const handleUpload = async (uri: string) => {
        setUploading(true);
        setProgress(0);
        try {
            const uploadedData = await uploadImageToCloudinary(uri, (p) => {
                setProgress(p / 100);
            });
            onUploadComplete(uploadedData);
        } catch (err) {
            console.error("Upload failed!", err);
            setLocalUri(null);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };
    
    // ✅ DEFAULT IMAGE FIX: Ab yeh local 'require' aur network 'uri' dono ko handle karega.
    const imageSource: ImageSourcePropType = localUri
        ? { uri: localUri }
        : avatarUrl
        ? { uri: avatarUrl }
        : require('../../../assets/default-avatar.png'); // Aapka local default avatar

    return (
        <View style={tw`items-center my-4`}>
            <TouchableOpacity onPress={pickImage} disabled={uploading}>
                <View style={tw`relative w-32 h-32`}>
                    <Image
                        source={imageSource}
                        style={tw`w-32 h-32 rounded-full`}
                    />
                    {uploading && (
                        <View style={tw`absolute inset-0 bg-black bg-opacity-60 rounded-full justify-center items-center`}>
                            <Progress.Circle 
                                size={80} 
                                progress={progress} 
                                color="#4ade80"
                                thickness={6}
                                showsText={true}
                                formatText={() => `${Math.round(progress * 100)}%`}
                                textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}
                                borderWidth={0}
                            />
                        </View>
                    )}
                    {!uploading && (
                        <View style={tw`absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full`}>
                            <Camera size={20} color="#fff" />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};