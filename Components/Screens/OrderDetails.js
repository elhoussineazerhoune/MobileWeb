import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, StatusBar, ActivityIndicator, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInDown } from 'react-native-reanimated';
import axios from 'axios';

function OrderDetails({ route, navigation }) {
    const { orderId, userId } = route.params;
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId, userId]);

    const fetchOrderDetails = async () => {
        try {
            // First fetch all orders for the user
            const response = await axios.get(`http://10.0.2.2:3306/api/commande/orders/${userId}`);
            console.log(response.data.data[3].details[0].article);
            
            if (response.data.success) {
                // Filter the specific order by ID
                const specificOrder = response.data.data.find(order => order.id === orderId);
                
                if (specificOrder) {
                    setOrderDetails({
                        ...specificOrder,
                        customer: {
                            name: `${specificOrder.client.nom} ${specificOrder.client.prenom}`,
                            email: specificOrder.client.email,
                            phone: specificOrder.client.contact,
                            address: specificOrder.client.adresse,
                        },
                        products: specificOrder.details.map(detail => ({
                            id: detail.article.id,
                            name: detail.article.nom,
                            quantity: detail.quantite,
                            price: detail.article.puv,
                            type: `Category ${detail.article.categoryId}`,
                            image: detail.article.image,
                            description: detail.article.description,
                            totalLigne: detail.totalLigne
                        })),
                        total: specificOrder.prixTotal,
                        date: specificOrder.createdAt,
                        status: specificOrder.status || 'pending'
                    });
                } else {
                    Alert.alert('Error', 'Order not found');
                }
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            Alert.alert('Error', 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'validé':
                return { bg: '#E7F3EF', text: '#2D6A4F' };
            case 'terminé': 
                return { bg: '#ECFDF5', text: '#059669' };
            case 'en attente': 
                return { bg: '#FEF3C7', text: '#B45309' };
            case 'en cours': 
                return { bg: '#DBEAFE', text: '#2563EB' };
            case 'annulé': 
                return { bg: '#FEE2E2', text: '#DC2626' };
            default: 
                return { bg: '#E5E7EB', text: '#374151' };
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'En attente': 'PENDING',
            'validé': 'VALIDATED',
            'annulé': 'CANCELLED',
            'en cours': 'PROCESSING',
            'terminé': 'COMPLETED'
        };
        return statusMap[status] || status?.toUpperCase();
    };

    const renderProductCard = (product) => (
        <Animated.View 
            key={product.id}
            entering={FadeInDown.duration(400)}
            style={styles.productCard}
        >
            <Image 
                source={{ uri: `http://10.0.2.2:3306/images/${product.image}` }}
                style={styles.productImage} 
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                {/* <Text style={styles.productType}>{product.type}</Text> */}
                <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>{product.price} MAD</Text>
                    <Text style={styles.productQuantity}>×{product.quantity}</Text>
                </View>
            </View>
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF385C" />
            </View>
        );
    }

    if (!orderDetails) {
        return <Text>Loading...</Text>;
    }

    const renderPriceSummary = () => (
        <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Products Total</Text>
                <Text style={styles.priceValue}>
                    {orderDetails.total} MAD
                </Text>
            </View>
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                    {orderDetails.total} MAD
                </Text>
            </View>
        </View>
    );

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
                            {getStatusText(orderDetails.status)}
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
                        {orderDetails.products.map(product => renderProductCard(product))}
                    </View>

                    {renderPriceSummary()}
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default OrderDetails;
