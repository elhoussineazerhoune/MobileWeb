import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Pressable, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import SmallButton from "../Common/SmallButton";
import ProductCard from "../Common/ProductCard";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../context/CartContext';

const data = [
    {
        id: "1",
        name: "Nike Shoe",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p2.jpeg"),
        isFavorite: true,
    },
    {
        id: "2",
        name: "Sneakers ft",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p3.jpeg"),
        isFavorite: false,
    },
    {
        id: "3",
        name: "Sneakers ft",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p4.jpeg"),
        isFavorite: false,
    },
    {
        id: "4",
        name: "Sneakers ft",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p5.jpeg"),
        isFavorite: false,
    },

];

const CART_STORAGE_KEY = '@shopping_cart';

export default function ProductsSection({ type }) {
    const navigation = useNavigation();
    const [loadingStates, setLoadingStates] = useState({});
    const [cartQuantities, setCartQuantities] = useState({});
    const { updateCartCount } = useCart();
    const [selectedSize, setSelectedSize] = useState(null);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Add this new function to check cart items
    const loadCartQuantities = async () => {
        try {
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                const quantities = {};
                cart.forEach(item => {
                    quantities[item.id] = item.quantity;
                });
                setCartQuantities(quantities);
            }
        } catch (error) {
            console.error('Error loading cart quantities:', error);
        }
    };

    useEffect(() => {
        loadCartQuantities();
    }, []);

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setSelectedSize(null);
        setShowSizeModal(true);
    };

    const confirmAddToCart = async () => {
        if (selectedSize && selectedProduct) {
            await updateQuantity(selectedProduct, 1, selectedSize);
            setShowSizeModal(false);
            setSelectedProduct(null);
            setSelectedSize(null);
        }
    };

    const updateQuantity = async (product, change, size) => {
        try {
            setLoadingStates(prev => ({ ...prev, [product.id]: true }));
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            let cart = savedCart ? JSON.parse(savedCart) : [];
            
            const productWithSize = { ...product, size };
            const existingProduct = cart.find(item => 
                item.id === product.id && item.size === size
            );
            
            if (existingProduct) {
                existingProduct.quantity = Math.max(0, existingProduct.quantity + change);
                if (existingProduct.quantity === 0) {
                    cart = cart.filter(item => !(item.id === product.id && item.size === size));
                }
            } else if (change > 0) {
                cart.push({ ...productWithSize, quantity: 1 });
            }

            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            updateCartCount();
            await loadCartQuantities();
        } catch (error) {
            console.error('Error updating cart:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [product.id]: false }));
        }
    };

    const SizeSelectionModal = () => (
        <Modal
            visible={showSizeModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowSizeModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Size</Text>
                    <View style={styles.sizeContainer}>
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <TouchableOpacity
                                key={size}
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
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.modalActions}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={() => setShowSizeModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.confirmButton,
                                !selectedSize && styles.disabledButton
                            ]}
                            onPress={confirmAddToCart}
                            disabled={!selectedSize}
                        >
                            <Text style={styles.confirmButtonText}>Add to Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderItem = ({ item }) => (
        <Pressable 
            style={styles.card}
            onPress={() => navigation.navigate("ProductDetails", { product: item })}
        >
            <View style={styles.imageContainer}>
                <Image source={item.imageUri} style={styles.image} resizeMode="cover" />
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="gold" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.productInfo}>
                    <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                </View>

                <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => navigation.navigate("ProductDetails", { product: item })}
                >
                    <Ionicons name="eye-outline" size={14} color="#fff" />
                    <Text style={styles.viewDetailsText}>Details</Text>
                </TouchableOpacity>
            </View>
        </Pressable>
    );

    return (
        <>
            <Animated.View entering={FadeInRight.duration(700)} className='mb-[5px]'>
                <View className="flex flex-row mt-2 ">
                    <Text className="font-[Rubik-SemiBold] text-xl my-3 ml-3 flex-1">
                        {type}
                    </Text>
                    <View className="mr-3">
                        <SmallButton onPress={() => navigation.navigate("Search")}>
                            Voir plus
                        </SmallButton>
                    </View>
                </View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    showsHorizontalScrollIndicator={false}
                />
            </Animated.View>
            <SizeSelectionModal />
        </>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginHorizontal: 8,
        width: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 160,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 2,
    },
    contentContainer: {
        padding: 12,
    },
    productInfo: {
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF385C',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        gap: 4,
    },
    viewDetailsText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF385C', // Using the theme color
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '600',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF385C',
        borderRadius: 20,
        padding: 4,
        marginTop: 8,
    },
    quantityButton: {
        padding: 4,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginHorizontal: 8,
        minWidth: 20,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    sizeButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSizeButton: {
        backgroundColor: '#FF385C',
        borderColor: '#FF385C',
    },
    sizeText: {
        fontSize: 16,
        color: '#333',
    },
    selectedSizeText: {
        color: 'white',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 15,
    },
    cancelButton: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FF385C',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    cancelButtonText: {
        color: '#333',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF385C',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 8,
        justifyContent: 'center',
    },
    viewDetailsText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '600',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    sizeTag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    sizeText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    productContent: {
        padding: 12,
        alignItems: 'center',
    },
    productInfo: {
        alignItems: 'center',
        marginBottom: 8,
    },
});

