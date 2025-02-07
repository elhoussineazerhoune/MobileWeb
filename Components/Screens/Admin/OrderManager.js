import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function OrderManager({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:3306/api/commande/');
            setOrders(response.data.data);
            // console.log(response.data.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    // Status translation map
    const statusMap = {
        'En attente': 'Pending',
        'validé': 'Validated',
        'annulé': 'Cancelled',
        'en cours': 'Processing',
        'terminé': 'Completed'
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const response = await axios.post('http://10.0.2.2:3306/api/commande/updatecommand', {
                id,
                newStatus
            });
            console.log(response.data);
            
            
            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                fetchOrders(); // Refresh list
            } else {
                Alert.alert('Error', 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            Alert.alert('Error', 'Failed to update order status');
        }
    };

    const renderStatusButton = (status, orderId) => (
        <View style={styles.statusButtons}>
            <Pressable
                style={[styles.statusButton, status === 'En attente' && styles.activeStatus]}
                onPress={() => handleUpdateStatus(orderId, 'En attente')}
            >
                <Text style={[
                    styles.statusButtonText,
                    status === 'En attente' && { color: '#FFF' }
                ]}>Pending</Text>
            </Pressable>
            <Pressable
                style={[styles.statusButton, status === 'en cours' && styles.activeStatus]}
                onPress={() => handleUpdateStatus(orderId, 'en cours')}
            >
                <Text style={[
                    styles.statusButtonText,
                    status === 'en cours' && { color: '#FFF' }
                ]}>Processing</Text>
            </Pressable>
            <Pressable
                style={[styles.statusButton, status === 'validé' && styles.activeStatus]}
                onPress={() => handleUpdateStatus(orderId, 'validé')}
            >
                <Text style={[
                    styles.statusButtonText,
                    status === 'validé' && { color: '#FFF' }
                ]}>Validated</Text>
            </Pressable>
            <Pressable
                style={[styles.statusButton, status === 'terminé' && styles.activeStatus]}
                onPress={() => handleUpdateStatus(orderId, 'terminé')}
            >
                <Text style={[
                    styles.statusButtonText,
                    status === 'terminé' && { color: '#FFF' }
                ]}>Completed</Text>
            </Pressable>
            <Pressable
                style={[styles.statusButton, status === 'annulé' && styles.activeStatus]}
                onPress={() => handleUpdateStatus(orderId, 'annulé')}
            >
                <Text style={[
                    styles.statusButtonText,
                    status === 'annulé' && { color: '#FFF' }
                ]}>Cancelled</Text>
            </Pressable>
        </View>
    );

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.orderDetails}>
                <Text style={styles.customerName}>{item.customerName}</Text>
                <Text style={styles.orderTotal}>{item.prixTotal.toFixed(2)} MAD</Text>
            </View>
            <View style={styles.orderStatus}>
                <Text style={styles.statusLabel}>Status:</Text>
                <Text style={[styles.statusValue, getStatusStyle(item.status)]}>
                    {statusMap[item.status] || item.status}
                </Text>
            </View>
            {renderStatusButton(item.status, item.id)}
            <Pressable
                style={styles.viewButton}
                onPress={() => navigation.navigate('OrderDetails', {
                    orderId: item.id,
                    userId: item.clientId // Add this when navigating
                })}
            >
            <Text style={styles.viewButtonText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#FF385C" />
        </Pressable>
        </View >
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
                <Text style={styles.headerTitle}>Order Management</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
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
    listContainer: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    orderDate: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    customerName: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    orderTotal: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#FF385C',
    },
    statusButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 12,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
    },
    activeStatus: {
        backgroundColor: '#FF385C',
    },
    statusButtonText: {
        fontSize: 12,
        fontFamily: 'Poppins-Medium',
        color: '#666',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#FFF0F3',
        gap: 8,
    },
    viewButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#FF385C',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginRight: 8,
    },
    statusValue: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    }
});

const getStatusStyle = (status) => {
    switch(status) {
        case 'validé':
            return { color: '#2D6A4F' };
        case 'terminé':
            return { color: '#059669' };
        case 'En attente':
            return { color: '#B45309' };
        case 'en cours':
            return { color: '#2563EB' };
        case 'annulé':
            return { color: '#DC2626' };
        default:
            return { color: '#374151' };
    }
};
