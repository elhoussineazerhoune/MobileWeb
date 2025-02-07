import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function OrderConfirmationScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Animated.View 
                entering={FadeInDown.duration(400)}
                style={styles.content}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="#FF385C" />
                </View>
                <Text style={styles.title}>Order Confirmed!</Text>
                <Text style={styles.message}>
                    Your order has been placed successfully.
                </Text>
                <Pressable 
                    style={styles.button}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>Continue Shopping</Text>
                </Pressable>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#333',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FF385C',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
});
