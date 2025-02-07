import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CATEGORIES = ['Men', 'Women', 'Kids'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function EditProduct({ navigation, route }) {
    const { productId } = route.params;
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        sizes: [],
        image: null
    });

    useEffect(() => {
        fetchProductDetails();
        console.log(productId);
        
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3306/api/article/${productId}`);
            console.log(response.data);
            
            const product = response.data.filteredProducts[0];
            setProductData({
                name: product.nom,
                price: product.puv.toString(),
                category: product.category || '',
                description: product.description || '',
                stock: product.stock.toString(),
                sizes: product.sizes ? JSON.parse(product.sizes) : [],
                image: product.image ? { uri: product.image } : null
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to load product details');
            navigation.goBack();
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

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

            const formData = new FormData();
            formData.append('nom', productData.name);
            formData.append('puv', productData.price);
            formData.append('category', productData.category);
            formData.append('description', productData.description);
            formData.append('stock', productData.stock);
            formData.append('sizes', JSON.stringify(productData.sizes));
            
            if (productData.image && !productData.image.uri.startsWith('http')) {
                const imageUri = productData.image.uri;
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('image', {
                    uri: imageUri,
                    name: filename,
                    type
                });
            }

            await axios.put(
                `http://10.0.2.2:3306/api/article/${productId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            Alert.alert('Success', 'Product updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Failed to update product');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF385C" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Edit Product</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Enhanced Image Section */}
                <View style={styles.imageSection}>
                    <Pressable style={styles.imageUpload} onPress={pickImage}>
                        {productData.image ? (
                            <>
                                <Image source={productData.image} style={styles.productImage} />
                                <View style={styles.imageOverlay}>
                                    <Ionicons name="camera" size={24} color="#FFF" />
                                    <Text style={styles.changeImageText}>Change Image</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="image-outline" size={40} color="#999" />
                                <Text style={styles.uploadText}>Upload Product Image</Text>
                            </View>
                        )}
                    </Pressable>
                </View>

                {/* Form Content */}
                <View style={styles.formContent}>
                    {/* Product Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Product Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={productData.name}
                            onChangeText={(text) => setProductData({...productData, name: text})}
                            placeholder="Enter product name"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Category Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category *</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            style={styles.categoryContainer}
                        >
                            {CATEGORIES.map((category) => (
                                <Pressable
                                    key={category}
                                    style={[
                                        styles.categoryChip,
                                        productData.category === category && styles.categoryChipSelected
                                    ]}
                                    onPress={() => setProductData({...productData, category})}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        productData.category === category && styles.categoryTextSelected
                                    ]}>{category}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Sizes Grid */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Available Sizes</Text>
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

                    {/* Price and Stock Row */}
                    <View style={styles.rowInputs}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Price (MAD) *</Text>
                            <TextInput
                                style={styles.input}
                                value={productData.price}
                                onChangeText={(text) => setProductData({...productData, price: text})}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Stock *</Text>
                            <TextInput
                                style={styles.input}
                                value={productData.stock}
                                onChangeText={(text) => setProductData({...productData, stock: text})}
                                placeholder="0"
                                keyboardType="number-pad"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={productData.description}
                            onChangeText={(text) => setProductData({...productData, description: text})}
                            placeholder="Enter product description"
                            multiline
                            numberOfLines={4}
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Update Button */}
                    <Pressable 
                        style={styles.submitButton} 
                        onPress={handleSubmit}
                    >
                        <Ionicons name="save-outline" size={20} color="#FFF" style={styles.submitIcon} />
                        <Text style={styles.submitButtonText}>Update Product</Text>
                    </Pressable>
                </View>
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
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    formContainer: {
        flex: 1,
    },
    imageSection: {
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    imageUpload: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeImageText: {
        color: '#FFF',
        marginTop: 8,
        fontSize: 16,
    },
    formContent: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    rowInputs: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    categoryContainer: {
        marginBottom: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    categoryChipSelected: {
        backgroundColor: '#FF385C',
        borderColor: '#FF385C',
    },
    categoryText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
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
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    sizeChipSelected: {
        backgroundColor: '#FF385C',
        borderColor: '#FF385C',
    },
    sizeText: {
        color: '#666',
        fontWeight: '500',
    },
    sizeTextSelected: {
        color: '#FFFFFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#FF385C',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
        elevation: 2,
    },
    submitIcon: {
        marginRight: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});
