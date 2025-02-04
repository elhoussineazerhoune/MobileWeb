import { View, Text, StyleSheet, FlatList, Image, Pressable, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useCart } from '../../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SORT_OPTIONS = ['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low'];
const CART_STORAGE_KEY = '@shopping_cart';

export default function CategoryScreen({ route, navigation }) {
    const { categorie } = route.params;
    const [selectedSort, setSelectedSort] = useState('Popular');
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([
        {
            id: '1',
            name: 'Nike Air Max',
            price: '129.99$',
            rating: '4.8',
            imageUri: require('../../assets/products/p2.jpeg'),
        },
        // Add more products...
    ]);
    const [loadingStates, setLoadingStates] = useState({});
    const [cartQuantities, setCartQuantities] = useState({});
    const { updateCartCount, cartCount } = useCart();  // Add this line
    const [selectedSize, setSelectedSize] = useState(null);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadCartQuantities = async () => {
        try {
            const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const cart = JSON.parse(savedCart);
                const quantities = {};
                cart.forEach(item => {
                    if (!quantities[item.id]) {
                        quantities[item.id] = {};
                    }
                    quantities[item.id][item.size] = item.quantity;
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
            
            const existingProduct = cart.find(item => 
                item.id === product.id && item.size === size
            );
            
            if (existingProduct) {
                existingProduct.quantity = Math.max(0, existingProduct.quantity + change);
                if (existingProduct.quantity === 0) {
                    cart = cart.filter(item => !(item.id === product.id && item.size === size));
                }
            } else if (change > 0) {
                cart.push({ ...product, size, quantity: 1 });
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

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTotalQuantityForProduct = (productId) => {
        if (!cartQuantities[productId]) return 0;
        return Object.values(cartQuantities[productId]).reduce((sum, qty) => sum + qty, 0);
    };

    const renderProduct = ({ item }) => (
        <Animated.View 
            entering={FadeInDown.delay(100 * parseInt(item.id)).duration(400)}
            style={styles.productCard}
        >
            <TouchableOpacity 
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
            >
                <Image source={item.imageUri} style={styles.productImage} />
            </TouchableOpacity>
            
            <View style={styles.productContent}>
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="gold" />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                </View>

                <View style={styles.cartActions}>
                    {getTotalQuantityForProduct(item.id) > 0 ? (
                        <TouchableOpacity 
                            style={styles.viewDetailsButton}
                            onPress={() => navigation.navigate("ProductDetails", { product: item })}
                        >
                            <Text style={styles.viewDetailsText}>
                                {getTotalQuantityForProduct(item.id)} in cart
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => handleAddToCart(item)}
                            disabled={loadingStates[item.id]}
                        >
                            {loadingStates[item.id] ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons name="add" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Animated.View>
    );

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{categorie}</Text>
                    <Pressable onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
                        <Ionicons name="cart-outline" size={24} color="#333" />
                        {cartCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </Pressable>
                </View>

                {/* Search & Sort */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#666" />
                            </Pressable>
                        )}
                    </View>

                    <Pressable 
                        style={styles.sortButton}
                        onPress={() => setShowSortOptions(!showSortOptions)}
                    >
                        <Ionicons name="swap-vertical" size={20} color="#333" />
                        <Text style={styles.sortText}>Sort</Text>
                    </Pressable>
                </View>

                {/* Sort Options Dropdown */}
                {showSortOptions && (
                    <View style={styles.sortOptionsOverlay}>
                        <Pressable 
                            style={styles.overlayBackdrop} 
                            onPress={() => setShowSortOptions(false)}
                        />
                        <View style={styles.sortOptions}>
                            {SORT_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.sortOption,
                                        selectedSort === option && styles.selectedSort
                                    ]}
                                    onPress={() => {
                                        setSelectedSort(option);
                                        setShowSortOptions(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        selectedSort === option && styles.selectedSortText
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {/* Products Grid */}
            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.productsList}
                showsVerticalScrollIndicator={false}
                style={styles.productList}
            />
            <SizeSelectionModal />
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
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
        gap: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 8,
        borderRadius: 8,
        gap: 4,
    },
    sortText: {
        color: '#333',
        fontWeight: '500',
    },
    sortOptionsOverlay: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    overlayBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: 1000, // Large enough to cover screen
    },
    sortOptions: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    sortOption: {
        padding: 12,
        borderRadius: 6,
    },
    selectedSort: {
        backgroundColor: '#FF385C',
    },
    sortOptionText: {
        color: '#333',
    },
    selectedSortText: {
        color: 'white',
    },
    productsList: {
        padding: 8,
    },
    productCard: {
        flex: 1,
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 2,
        overflow: 'hidden',
        padding: 0, // Remove padding
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    productContent: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        color: '#FF385C',
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    rating: {
        marginLeft: 4,
        color: '#666',
    },
    cartActions: {
        marginLeft: 8,
    },
    addButton: {
        backgroundColor: '#FF385C',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF385C',
        borderRadius: 20,
        padding: 4,
    },
    quantityButton: {
        padding: 4,
        width: 24,
        height: 24,
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
    headerContainer: {
        zIndex: 1000, // Ensure header stays above content
        backgroundColor: 'white',
        elevation: 4,
    },
    productList: {
        flex: 1,
        zIndex: 1,
    },
    cartButton: {
        position: 'relative',
        padding: 8,
    },
    badge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#FF385C',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
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
    },
    viewDetailsText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
