import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext(undefined); // Add export here

const CART_STORAGE_KEY = '@shopping_cart';

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = async () => {
        try {
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                // Sum up quantities across all items and sizes
                const count = cart.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    };

    useEffect(() => {
        updateCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
