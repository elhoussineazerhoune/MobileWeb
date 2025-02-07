import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, StatusBar } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInDown } from 'react-native-reanimated';

// Update mockup data with more details
const mockOrderDetails = {
    1: {
        id: 1,
        status: 'completed',
        date: '2024-01-15',
        total: 150.99,
        customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+33 6 12 34 56 78',
            address: '123 Rue Principal, Paris',
        },
        products: [
            { 
                id: 1, 
                name: 'Product 1', 
                quantity: 2, 
                price: 75.50,
                type: 'Electronics',
                image: require('../../assets/products/p1.jpeg'),
                inStock: 15,
                description: 'High quality product with premium features'
            },
            { 
                id: 2, 
                name: 'Product 2', 
                quantity: 1, 
                price: 25.99,
                type: 'Accessories',
                image: require('../../assets/products/p2.jpeg'),
                inStock: 8,
                description: 'Premium accessory for daily use'
            }
        ]
    },
    2: {
        id: 2,
        status: 'pending',
        date: '2024-01-20',
        total: 89.99,
        products: [
            { id: 3, name: 'Product 3', quantity: 1, price: 89.99 }
        ]
    },
    3: {
        id: 3,
        status: 'cancelled',
        date: '2024-01-22',
        total: 199.99,
        products: [
            { id: 4, name: 'Product 4', quantity: 2, price: 99.99 },
            { id: 5, name: 'Product 5', quantity: 1, price: 45.99 }
        ]
    }
};

function OrderDetails({ route, navigation }) {
    const { orderId } = route.params;
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Simulate API call with mockup data
        setOrderDetails(mockOrderDetails[orderId]);
    }, [orderId]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed': return { bg: '#E7F3EF', text: '#2D6A4F' };
            case 'pending': return { bg: '#FEF3C7', text: '#B45309' };
            case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626' };
            default: return { bg: '#E5E7EB', text: '#374151' };
        }
    };

    if (!orderDetails) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#FF385C" barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <Ionicons 
                    name="arrow-back"
                    size={24}
                    color="#FFF"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{width: 24}} />
            </View>

            <ScrollView style={styles.container}>
                <Animated.View 
                    entering={FadeInDown.duration(400)}
                    style={styles.mainCard}
                >
                    {/* Order Status Banner */}
                    <View style={[
                        styles.statusBanner,
                        { backgroundColor: getStatusColor(orderDetails.status).bg }
                    ]}>
                        <Ionicons 
                            name={orderDetails.status === 'completed' ? 'checkmark-circle' : 
                                  orderDetails.status === 'pending' ? 'time' : 'close-circle'}
                            size={24}
                            color={getStatusColor(orderDetails.status).text}
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(orderDetails.status).text }]}>
                            {orderDetails.status.toUpperCase()}
                        </Text>
                    </View>

                    {/* Order Info */}
                    <View style={styles.orderInfo}>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Order ID</Text>
                            <Text style={styles.orderValue}>#{orderDetails.id}</Text>
                        </View>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Date</Text>
                            <Text style={styles.orderValue}>
                                {new Date(orderDetails.date).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* Customer Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Customer Information</Text>
                        <View style={styles.customerCard}>
                            <Text style={styles.infoRow}>
                                <Ionicons name="person" size={14} /> {orderDetails.customer.name}
                            </Text>
                            <Text style={styles.infoRow}>
                                <Ionicons name="mail" size={14} /> {orderDetails.customer.email}
                            </Text>
                            <Text style={styles.infoRow}>
                                <Ionicons name="call" size={14} /> {orderDetails.customer.phone}
                            </Text>
                            <Text style={styles.infoRow}>
                                <Ionicons name="location" size={14} /> {orderDetails.customer.address}
                            </Text>
                        </View>
                    </View>

                    {/* Products Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Products</Text>
                        {orderDetails.products.map(product => (
                            <Animated.View 
                                key={product.id}
                                entering={FadeInDown.duration(400)}
                                style={styles.productCard}
                            >
                                <Image source={product.image} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{product.name}</Text>
                                    <Text style={styles.productType}>{product.type}</Text>
                                    <View style={styles.productMeta}>
                                        <Text style={styles.productPrice}>${product.price}</Text>
                                        <Text style={styles.productQuantity}>×{product.quantity}</Text>
                                    </View>
                                </View>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Price Summary */}
                    <View style={styles.priceSummary}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Subtotal</Text>
                            <Text style={styles.priceValue}>
                                ${(orderDetails.total * 0.8).toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Tax (20%)</Text>
                            <Text style={styles.priceValue}>
                                ${(orderDetails.total * 0.2).toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>
                                ${orderDetails.total.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FF385C',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FF385C',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#FFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    mainCard: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        marginTop: 8,
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        gap: 8,
    },
    statusText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    orderInfo: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginBottom: 16,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    productName: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    productType: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    productMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#FF385C',
    },
    priceSummary: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalValue: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#FF385C',
    }
});

export default OrderDetails;
