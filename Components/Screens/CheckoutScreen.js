import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, TextInput } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen({ route, navigation }) {
    const { total = 0, items = [] } = route.params || {};
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: ''
    });
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('ClientToken');
            if (!token) {
                navigation.replace('MainContainer', {
                    screen: 'Login',
                    params: { 
                        returnTo: 'checkout',
                        params: route.params
                    }
                });
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            navigation.goBack();
        }
    };

    const handlePlaceOrder = async () => {
        // Validate all required fields
        if (!validateForm()) {
            alert('Please fill in all required information');
            return;
        }

        try {
            const orderDetails = {
                deliveryInfo,
                paymentMethod,
                cardInfo: paymentMethod === 'card' ? cardInfo : null,
                items,
                total: total + 5,
                status: 'pending',
                date: new Date().toISOString()
            };
            
            await AsyncStorage.removeItem(CART_STORAGE_KEY);
            navigation.navigate('OrderConfirmation');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    };

    const validateForm = () => {
        if (!deliveryInfo.fullName || !deliveryInfo.address || 
            !deliveryInfo.city || !deliveryInfo.postalCode) {
            return false;
        }
        
        if (paymentMethod === 'card') {
            if (!cardInfo.cardNumber || !cardInfo.expiry || !cardInfo.cvv) {
                return false;
            }
        }
        
        return true;
    };

    const renderPaymentSection = () => (
        <Animated.View 
            entering={FadeInDown.duration(400)}
            style={styles.section}
        >
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentOptions}>
                {[
                    { id: 'card', icon: 'card-outline', label: 'Credit Card' },
                    { id: 'cash', icon: 'cash-outline', label: 'Cash on Delivery' }
                ].map((method) => (
                    <Pressable 
                        key={method.id}
                        style={[
                            styles.paymentOption,
                            paymentMethod === method.id && styles.paymentOptionActive
                        ]}
                        onPress={() => setPaymentMethod(method.id)}
                    >
                        <Ionicons 
                            name={method.icon}
                            size={24}
                            color={paymentMethod === method.id ? '#FF385C' : '#666'}
                        />
                        <Text style={[
                            styles.paymentText,
                            paymentMethod === method.id && styles.paymentTextActive
                        ]}>
                            {method.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
            
            {paymentMethod === 'card' && (
                <View style={styles.cardInputs}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Card Number"
                        value={cardInfo.cardNumber}
                        onChangeText={(text) => setCardInfo({...cardInfo, cardNumber: text})}
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        maxLength={16}
                    />
                    <View style={styles.row}>
                        <TextInput 
                            style={[styles.input, { flex: 1, marginRight: 8 }]}
                            placeholder="MM/YY"
                            value={cardInfo.expiry}
                            onChangeText={(text) => setCardInfo({...cardInfo, expiry: text})}
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            maxLength={5}
                        />
                        <TextInput 
                            style={[styles.input, { flex: 1 }]}
                            placeholder="CVV"
                            value={cardInfo.cvv}
                            onChangeText={(text) => setCardInfo({...cardInfo, cvv: text})}
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            secureTextEntry
                            maxLength={3}
                        />
                    </View>
                </View>
            )}
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{width: 40}} />
            </View>

            <ScrollView style={styles.content}>
                {/* Delivery Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.inputGroup}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#999"
                            value={deliveryInfo.fullName}
                            onChangeText={(text) => setDeliveryInfo({...deliveryInfo, fullName: text})}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder="Street Address"
                            placeholderTextColor="#999"
                            value={deliveryInfo.address}
                            onChangeText={(text) => setDeliveryInfo({...deliveryInfo, address: text})}
                        />
                        <View style={styles.row}>
                            <TextInput 
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                placeholder="City"
                                placeholderTextColor="#999"
                                value={deliveryInfo.city}
                                onChangeText={(text) => setDeliveryInfo({...deliveryInfo, city: text})}
                            />
                            <TextInput 
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Postal Code"
                                placeholderTextColor="#999"
                                value={deliveryInfo.postalCode}
                                onChangeText={(text) => setDeliveryInfo({...deliveryInfo, postalCode: text})}
                            />
                        </View>
                    </View>
                </View>

                {/* Payment Section */}
                {renderPaymentSection()}

                {/* Order Summary */}
                <View style={styles.summarySection}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                            <Text style={styles.itemPrice}>${item.price}</Text>
                        </View>
                    ))}
                    <View style={styles.totalsContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${(total * 0.9).toFixed(2)}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Delivery Fee</Text>
                            <Text style={styles.totalValue}>$5.00</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tax (10%)</Text>
                            <Text style={styles.totalValue}>${(total * 0.1).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalRow, styles.finalTotal]}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>${(total + 5).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable 
                    style={styles.placeOrderButton}
                    onPress={handlePlaceOrder}
                >
                    <Text style={styles.placeOrderText}>Place Order</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                </Pressable>
            </View>
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
        backgroundColor: '#FF385C',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#FFF',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    steps: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    stepContainer: {
        alignItems: 'center',
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepCircleActive: {
        backgroundColor: '#FF385C',
    },
    stepNumber: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    stepNumberActive: {
        color: '#FFF',
    },
    stepLabel: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    content: {
        flex: 1,
        padding: 16,
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
    input: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginTop:10
    },
    row: {
        flexDirection: 'row',
    },
    paymentOptions: {
        flexDirection: 'column',
        gap: 12,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f8f8f8',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    paymentOptionActive: {
        backgroundColor: '#FFF0F3',
        borderWidth: 1,
        borderColor: '#FF385C',
    },
    paymentText: {
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    paymentTextActive: {
        color: '#FF385C',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 16,
        marginTop: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    confirmButton: {
        backgroundColor: '#FF385C',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    itemQuantity: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginHorizontal: 12,
    },
    itemPrice: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#FF385C',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    nextButton: {
        backgroundColor: '#FF385C',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        flex: 2,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    totalsContainer: {
        backgroundColor: '#f8f8f8',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    finalTotal: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginTop: 12,
        paddingTop: 12,
    },
    grandTotalLabel: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
    grandTotalValue: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#FF385C',
    },
    placeOrderButton: {
        backgroundColor: '#FF385C',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    placeOrderText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    },
});
