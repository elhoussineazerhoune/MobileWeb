import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; // Changed this import
import axios from 'axios';
import { Platform } from 'react-native';

const CATEGORIES = [
    { id: 1, name: 'Men' },
    { id: 2, name: 'Women' },
    { id: 3, name: 'Kids' }
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AddProduct({ navigation }) {
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        sizes: [],
        image: null
    });

    const pickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setProductData({
                    ...productData,
                    image: { uri: result.assets[0].uri }
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const toggleSize = (size) => {
        const sizes = [...productData.sizes];
        const index = sizes.indexOf(size);
        if (index > -1) {
            sizes.splice(index, 1);
        } else {
            sizes.push(size);
        }
        setProductData({...productData, sizes});
    };

    const handleSubmit = async () => {
        try {
            if (!productData.name || !productData.price || !productData.category || !productData.stock) {
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }

            if (!productData.image) {
                Alert.alert('Error', 'Please select an image');
                return;
            }

            const formData = new FormData();
            formData.append('nom', productData.name);
            formData.append('puv', productData.price);
            formData.append('stock', productData.stock);
            formData.append('categorie_id', productData.category);
            formData.append('description', productData.description || '');
            formData.append('size', productData.sizes.join(','));

            if (productData.image) {
                const imageUri = Platform.OS === 'ios' ? 
                    productData.image.uri.replace('file://', '') : 
                    productData.image.uri;
                const filename = productData.image.uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image';

                formData.append('image', {
                    uri: imageUri,
                    name: filename,
                    type: type
                });
            }

            const response = await axios.post(
                'http://10.0.2.2:3306/api/article/add',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                // Reset form
                setProductData({
                    name: '',
                    price: '',
                    category: '',
                    description: '',
                    stock: '',
                    sizes: [],
                    image: null
                });
            }
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add product';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Add New Product</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.formContainer}>
                <Pressable style={styles.imageUpload} onPress={pickImage}>
                    {productData.image ? (
                        <Image source={productData.image} style={styles.productImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="camera" size={40} color="#999" />
                            <Text style={styles.uploadText}>Upload Image</Text>
                        </View>
                    )}
                </Pressable>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={productData.name}
                        onChangeText={(text) => setProductData({...productData, name: text})}
                        placeholder="Enter product name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category *</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                        {CATEGORIES.map((category) => (
                            <Pressable
                                key={category.id}
                                style={[
                                    styles.categoryChip,
                                    productData.category === category.id && styles.categoryChipSelected
                                ]}
                                onPress={() => setProductData({...productData, category: category.id})}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    productData.category === category.id && styles.categoryTextSelected
                                ]}>{category.name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sizes</Text>
                    <View style={styles.sizesContainer}>
                        {SIZES.map((size) => (
                            <Pressable
                                key={size}
                                style={[
                                    styles.sizeChip,
                                    productData.sizes.includes(size) && styles.sizeChipSelected
                                ]}
                                onPress={() => toggleSize(size)}
                            >
                                <Text style={[
                                    styles.sizeText,
                                    productData.sizes.includes(size) && styles.sizeTextSelected
                                ]}>{size}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price *</Text>
                    <TextInput
                        style={styles.input}
                        value={productData.price}
                        onChangeText={(text) => setProductData({...productData, price: text})}
                        placeholder="Enter price"
                        keyboardType="decimal-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stock *</Text>
                    <TextInput
                        style={styles.input}
                        value={productData.stock}
                        onChangeText={(text) => setProductData({...productData, stock: text})}
                        placeholder="Enter stock quantity"
                        keyboardType="number-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={productData.description}
                        onChangeText={(text) => setProductData({...productData, description: text})}
                        placeholder="Enter product description"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Add Product</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    placeholder: {
        width: 40,
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#FF385C',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom:20

    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        
    },
    imageUpload: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        color: '#999',
        marginTop: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    categoryChipSelected: {
        backgroundColor: '#FF385C',
    },
    categoryText: {
        color: '#666',
    },
    categoryTextSelected: {
        color: '#FFFFFF',
    },
    sizesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sizeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        minWidth: 50,
        alignItems: 'center',
    },
    sizeChipSelected: {
        backgroundColor: '#FF385C',
    },
    sizeText: {
        color: '#666',
    },
    sizeTextSelected: {
        color: '#FFFFFF',
    },
});
