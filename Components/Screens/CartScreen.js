import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useCart } from '../../context/CartContext';

const CART_STORAGE_KEY = '@shopping_cart';

const CartItem = ({ item, onUpdateQuantity }) => (
    <View style={styles.cartItem}>
        <Image source={item.imageUri} style={styles.itemImage} resizeMode="cover" />
        <View style={styles.itemInfo}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <View style={styles.sizeTag}>
                    <Text style={styles.sizeText}>Size: {item.size}</Text>
                </View>
            </View>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <View style={styles.quantityControl}>
                <Pressable onPress={() => onUpdateQuantity(item.id, item.size, -1)}>
                    <Ionicons name="remove-circle-outline" size={24} color="#333" />
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable onPress={() => onUpdateQuantity(item.id, item.size, 1)}>
                    <Ionicons name="add-circle-outline" size={24} color="#333" />
                </Pressable>
            </View>
        </View>
    </View>
);

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const { updateCartCount } = useCart();

    const loadCartItems = async () => {
        try {
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            console.log('Loaded cart data:', savedCart); // Debug log
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                console.log('Parsed cart items:', parsedCart); // Debug log
                setCartItems(parsedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    // Refresh cart items when screen focuses
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadCartItems();
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        loadCartItems();
    }, []);

    const updateQuantity = async (id, size, change) => {
        try {
            const updatedItems = cartItems.map(item => {
                if (item.id === id && item.size === size) {
                    const newQuantity = Math.max(0, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0);

            setCartItems(updatedItems);
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
            updateCartCount(); // Update cart count when quantity changes
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    // Group items by product ID for display
    const groupedItems = cartItems.reduce((groups, item) => {
        const key = item.id;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});

    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
    }, 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Shopping Cart ({cartItems.length})</Text>
                <View style={{ width: 24 }} />
            </View>

            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView style={styles.itemsList}>
                    {cartItems.length > 0 ? (
                        Object.values(groupedItems).map(items => (
                            items.map(item => (
                                <CartItem
                                    key={`${item.id}-${item.size}`}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                />
                            ))
                        ))
                    ) : (
                        <Text style={styles.emptyCart}>Your cart is empty</Text>
                    )}
                </ScrollView>
            </GestureHandlerRootView>

            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                    </View>
                    <Pressable style={styles.checkoutButton}>
                        <Text style={styles.checkoutButtonText}>Checkout</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemsList: {
        flex: 1,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 16,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    sizeTag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    sizeText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    itemPrice: {
        fontSize: 16,
        color: '#FF4C4C',
        fontWeight: 'bold',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantity: {
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF4C4C',
    },
    checkoutButton: {
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyCart: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 50,
    },
});
