import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');
const CART_STORAGE_KEY = '@shopping_cart';

export default function ProductDetailsScreen({ route, navigation }) {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
    const { updateCartCount } = useCart();
    const [sizeQuantities, setSizeQuantities] = useState({});
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        loadSizeQuantities();
    }, []);

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

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <Image source={product.imageUri} style={styles.image} />

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>{product.price}</Text>

                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={20} color="gold" />
                        <Text style={styles.rating}>{product.rating}</Text>
                        <Text style={styles.reviews}>(124 reviews)</Text>
                    </View>

                    <Text style={styles.description}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Text>

                    {/* Size Selection */}
                    <View style={styles.sizesSection}>
                        <Text style={styles.sectionTitle}>Select Size & Quantity</Text>
                        <View style={styles.sizeGrid}>
                            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
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
});
