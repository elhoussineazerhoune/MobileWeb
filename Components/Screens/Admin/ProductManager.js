import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductManager({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminAuth();
        fetchProducts();
    }, []);

    const checkAdminAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('AdminToken');
            if (!token) {
                navigation.replace('Login');
            }
        } catch (error) {
            console.error('Auth error:', error);
            navigation.replace('Login');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:3306/api/article/findAll');
            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to load products');
        }
    };

    const handleDeleteProduct = (productId) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`http://10.0.2.2:3306/api/admin/products/${productId}`);
                            fetchProducts();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete product');
                        }
                    }
                }
            ]
        );
    };

    const renderProductItem = ({ item }) => (
        <View style={styles.productCard}>
            <View style={styles.productInfo}>
                <View>
                    <Text style={styles.productName}>{item.nom}</Text>
                    <Text style={styles.productPrice}>{item.puv} MAD</Text>
                    <Text style={styles.productStock}>Stock: {item.stock}</Text>
                </View>
                <View style={styles.actionButtons}>
                    <Pressable 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => navigation.navigate('EditProduct', { productId: item.id })}
                    >
                        <Ionicons name="pencil" size={20} color="#FF385C" />
                    </Pressable>
                    <Pressable 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteProduct(item.id)}
                    >
                        <Ionicons name="trash" size={20} color="#FF385C" />
                    </Pressable>
                </View>
            </View>
        </View>
    );

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
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Product Management</Text>
                <Pressable 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddProduct')}
                >
                    <Ionicons name="add-circle" size={24} color="#FF385C" />
                </Pressable>
            </View>

            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
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
    addButton: {
        padding: 8,
    },
    listContainer: {
        padding: 16,
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        padding: 16,
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productName: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#FF385C',
        marginBottom: 4,
    },
    productStock: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    editButton: {
        borderColor: '#FF385C',
        backgroundColor: '#FFF0F3',
    },
    deleteButton: {
        borderColor: '#FF385C',
        backgroundColor: '#FFF0F3',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
