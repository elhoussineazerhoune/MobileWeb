import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView, StatusBar, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";

const CART_STORAGE_KEY = '@shopping_cart';

const PAYMENT_METHODS = [
    { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'cash', label: 'Cash on Delivery', icon: 'cash-outline' }
];

export default function CheckoutScreen({ route, navigation }) {
    const { total, items } = route.params;
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: 'Youmou@gmail.com',
        nom: '',
        prenom: '',
        address: '',
        telephone: ''
    });
    const [selectedPayment, setSelectedPayment] = useState('cash');

    // Load user info if available
    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsed = JSON.parse(userData);
                setUserInfo({
                    email: parsed.email || 'Youmou@gmail.com',
                    nom: parsed.nom || '',
                    prenom: parsed.prenom || '',
                    address: parsed.adresse || '',
                    telephone: parsed.contact || ''
                });
            }
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            setLoading(true);

            // Validate required fields
            if (!userInfo.email || !userInfo.nom || !userInfo.prenom || !userInfo.address || !userInfo.telephone) {
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }

            const orderData = {
                userInfo,
                basketItems: JSON.stringify(items),
                totalPrice: total,
                paymentMethod: selectedPayment
            };

            const response = await axios.post(
                'http://10.0.2.2:3306/api/commande/InsertCommand',
                orderData
            );

            if (response.data.success) {
                // Clear cart
                await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
                Alert.alert(
                    'Success',
                    'Order placed successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Home')
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Checkout error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.orderSummary}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Items ({items.length})</Text>
                        <Text style={styles.summaryValue}>{total.toFixed(2)} MAD</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                        <Text style={styles.summaryValue}>0.00 MAD</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>{total.toFixed(2)} MAD</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.sectionTitle}>Delivery Information</Text>
                    
                    <View style={styles.inputGroup}>
                        <View style={[styles.inputWrapper, styles.emailWrapper]}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <Text style={styles.emailText}>{userInfo.email}</Text>
                        </View>
                    </View>

                    <View style={styles.nameContainer}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={userInfo.prenom}
                                    onChangeText={(text) => setUserInfo({...userInfo, prenom: text})}
                                    placeholder="First Name"
                                />
                            </View>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={userInfo.nom}
                                    onChangeText={(text) => setUserInfo({...userInfo, nom: text})}
                                    placeholder="Last Name"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={userInfo.telephone}
                                onChangeText={(text) => setUserInfo({...userInfo, telephone: text})}
                                placeholder="Phone Number"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={userInfo.address}
                                onChangeText={(text) => setUserInfo({...userInfo, address: text})}
                                placeholder="Delivery Address"
                                multiline
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentMethods}>
                        {PAYMENT_METHODS.map((method) => (
                            <Pressable
                                key={method.id}
                                style={[
                                    styles.paymentOption,
                                    selectedPayment === method.id && styles.selectedPayment
                                ]}
                                onPress={() => setSelectedPayment(method.id)}
                            >
                                <Ionicons 
                                    name={method.icon} 
                                    size={24} 
                                    color={selectedPayment === method.id ? '#fff' : '#666'} 
                                />
                                <Text style={[
                                    styles.paymentText,
                                    selectedPayment === method.id && styles.selectedPaymentText
                                ]}>
                                    {method.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.checkoutButton, loading && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.checkoutButtonText}>Place Order</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    placeholder: {
        width: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    orderSummary: {
        margin: 16,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#666',
        fontSize: 15,
    },
    summaryValue: {
        color: '#333',
        fontSize: 15,
        fontWeight: '500',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF385C',
    },
    form: {
        padding: 16,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    disabledInput: {
        color: '#666',
        backgroundColor: '#f0f0f0',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    checkoutButton: {
        backgroundColor: '#FF385C',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.7,
    },
    emailWrapper: {
        backgroundColor: '#fff',
        borderColor: '#eee',
    },
    emailText: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        opacity: 1,
    },
    paymentMethods: {
        marginTop: 12,
        gap: 12,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        gap: 12,
    },
    selectedPayment: {
        backgroundColor: '#FF385C',
        borderColor: '#FF385C',
    },
    paymentText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    selectedPaymentText: {
        color: '#fff',
    },
});
