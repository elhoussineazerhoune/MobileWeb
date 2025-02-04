import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { Ionicons } from "@expo/vector-icons";

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
            <View style={styles.header}>
                <Icon 
                    name="arrow-back"
                    type="material"
                    size={28}
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTitle}>Détails Commande</Text>
                <View style={{width: 28}} />
            </View>

            <ScrollView style={styles.container}>
                <Card containerStyle={styles.card}>
                    <View style={styles.orderHeader}>
                        <View>
                            <Text style={styles.orderNumber}>Commande #{orderId}</Text>
                            <Text style={styles.date}>
                                <Ionicons name="calendar-outline" size={14} />
                                {' '}{new Date(orderDetails.date).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(orderDetails.status).bg }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: getStatusColor(orderDetails.status).text }
                            ]}>
                                {orderDetails.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Customer Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>
                            <Ionicons name="person-outline" size={18} /> Information Client
                        </Text>
                        <View style={styles.customerInfo}>
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

                    {/* Products Section with Enhanced Details */}
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>
                            <Ionicons name="cart-outline" size={18} /> Produits
                        </Text>
                        {orderDetails.products.map(product => (
                            <View key={product.id} style={styles.productCard}>
                                <Image 
                                    source={product.image} 
                                    style={styles.productImage}
                                />
                                <View style={styles.productDetails}>
                                    <Text style={styles.productName}>{product.name}</Text>
                                    <Text style={styles.productType}>Type: {product.type}</Text>
                                    <Text style={styles.productDescription}>{product.description}</Text>
                                    <View style={styles.productMetrics}>
                                        <View style={styles.metric}>
                                            <Text style={styles.metricLabel}>Quantité</Text>
                                            <Text style={styles.metricValue}>{product.quantity}</Text>
                                        </View>
                                        <View style={styles.metric}>
                                            <Text style={styles.metricLabel}>En Stock</Text>
                                            <Text style={styles.metricValue}>{product.inStock}</Text>
                                        </View>
                                        <View style={styles.metric}>
                                            <Text style={styles.metricLabel}>Prix Unit.</Text>
                                            <Text style={styles.metricValue}>{product.price}€</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    <View style={styles.totalSection}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Sous-total</Text>
                            <Text style={styles.totalValue}>{(orderDetails.total * 0.8).toFixed(2)}€</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TVA (20%)</Text>
                            <Text style={styles.totalValue}>{(orderDetails.total * 0.2).toFixed(2)}€</Text>
                        </View>
                        <View style={[styles.totalRow, styles.finalTotal]}>
                            <Text style={styles.totalAmount}>Total</Text>
                            <Text style={styles.totalAmount}>{orderDetails.total}€</Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
    card: {
        borderRadius: 15,
        margin: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    orderNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    date: {
        color: '#666',
        fontSize: 14,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#374151',
    },
    productsList: {
        marginBottom: 24,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    productQuantity: {
        color: '#666',
        fontSize: 14,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    totalSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        color: '#666',
        fontSize: 14,
    },
    totalValue: {
        fontSize: 14,
        color: '#374151',
    },
    finalTotal: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    section: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 16,
    },
    customerInfo: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    infoRow: {
        marginBottom: 8,
        fontSize: 14,
        color: '#4a5568',
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    productDetails: {
        flex: 1,
    },
    productType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    productMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metric: {
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
});

export default OrderDetails;
