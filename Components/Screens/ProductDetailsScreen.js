import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../context/CartContext';
import axios from 'axios';

const { width } = Dimensions.get('window');
const CART_STORAGE_KEY = '@shopping_cart';

export default function ProductDetailsScreen({ route, navigation }) {
    const { product } = route.params;
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updateCartCount } = useCart();
    const [sizeQuantities, setSizeQuantities] = useState({});
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        fetchProductDetails();
        loadSizeQuantities();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://10.0.2.2:3306/api/article/${product.id}`);
            if (response.data.success) {
                setProductDetails(response.data.product);
                console.log(productDetails);
                
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const loadSizeQuantities = async () => {
        try {
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                const quantities = {};
                cart.forEach(item => {
                    if (item.id === product.id) {
                        quantities[item.size] = item.quantity;
                    }
                });
                setSizeQuantities(quantities);
            }
        } catch (error) {
            console.error('Error loading quantities:', error);
        }
    };

    const updateQuantity = async (size, change) => {
        try {
            setLoading(true);
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            let cart = savedCart ? JSON.parse(savedCart) : [];
            
            const existingProduct = cart.find(item => 
                item.id === product.id && item.size === size
            );
            
            const newQuantity = (existingProduct?.quantity || 0) + change;
            
            if (newQuantity <= 0) {
                cart = cart.filter(item => !(item.id === product.id && item.size === size));
                setSizeQuantities(prev => {
                    const updated = { ...prev };
                    delete updated[size];
                    return updated;
                });
            } else {
                if (existingProduct) {
                    existingProduct.quantity = newQuantity;
                } else {
                    cart.push({ ...product, size, quantity: newQuantity });
                }
                setSizeQuantities(prev => ({
                    ...prev,
                    [size]: newQuantity
                }));
            }

            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            updateCartCount();
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Cart')}>
                    <Ionicons name="cart-outline" size={24} color="#333" />
                </Pressable>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF385C" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Product Image */}
                    <Image 
                        source={{ uri: `http://10.0.2.2:3306/images/${product?.image}` }} 
                        style={styles.image} 
                    />

                    {/* Product Info */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.name}>{product?.nom}</Text>
                        <Text style={styles.price}>{product?.puv} MAD</Text>

                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={20} color="gold" />
                            <Text style={styles.rating}>
                                {(Math.floor(Math.random() * 41) / 10 + 1).toFixed(1)}
                            </Text>
                            <Text style={styles.reviews}>(124 reviews)</Text>
                        </View>

                        <Text style={styles.description}>
                            {product?.description || 'No description available'}
                        </Text>

                        {/* Size Selection */}
                        <View style={styles.sizesSection}>
                            <Text style={styles.sectionTitle}>Select Size & Quantity</Text>
                            <View style={styles.sizeGrid}>
                                {(product?.size || '').split(',').map((size) => (
                                    <View key={size} style={styles.sizeContainer}>
                                        <Pressable 
                                            style={[
                                                styles.sizeButton,
                                                selectedSize === size && styles.selectedSizeButton
                                            ]}
                                            onPress={() => setSelectedSize(size)}
                                        >
                                            <Text style={[
                                                styles.sizeText,
                                                selectedSize === size && styles.selectedSizeText
                                            ]}>
                                                {size}
                                            </Text>
                                        </Pressable>
                                        {sizeQuantities[size] > 0 && (
                                            <View style={styles.quantityControl}>
                                                <TouchableOpacity 
                                                    style={styles.quantityButton}
                                                    onPress={() => updateQuantity(size, -1)}
                                                >
                                                    <Ionicons name="remove" size={20} color="#FF385C" />
                                                </TouchableOpacity>
                                                <Text style={styles.quantityText}>{sizeQuantities[size]}</Text>
                                                <TouchableOpacity 
                                                    style={styles.quantityButton}
                                                    onPress={() => updateQuantity(size, 1)}
                                                >
                                                    <Ionicons name="add" size={20} color="#FF385C" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}

            {/* Add to Cart Button */}
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Total Items:</Text>
                    <Text style={styles.totalItems}>
                        {Object.values(sizeQuantities).reduce((a, b) => a + b, 0)}
                    </Text>
                </View>
                {selectedSize && !sizeQuantities[selectedSize] ? (
                    <TouchableOpacity 
                        style={styles.addToCartButton}
                        onPress={() => updateQuantity(selectedSize, 1)}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addToCartText}>Add Selected Size</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={styles.viewCartButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.viewCartText}>View Cart</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    image: {
        width: width,
        height: width,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        color: '#FF385C',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    rating: {
        fontSize: 16,
        marginLeft: 4,
        marginRight: 8,
    },
    reviews: {
        color: '#666',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    sizeContainer: {
        alignItems: 'center',
        width: '18%',
    },
    sizeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 10,
    },
    sizeButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 14,
        color: '#666',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF385C',
    },
    addToCartButton: {
        backgroundColor: '#FF385C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        padding: 4,
    },
    quantityButton: {
        padding: 4,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    selectedSizeButton: {
        backgroundColor: '#FF385C',
        borderColor: '#FF385C',
    },
    selectedSizeText: {
        color: 'white',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    sizesSection: {
        padding: 16,
    },
    totalItems: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF385C',
    },
    viewCartButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    viewCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
