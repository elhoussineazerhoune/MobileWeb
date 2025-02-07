import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AdminDashboard({ navigation }) {
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('AdminToken');
            if (!token) {
                navigation.replace('Login');
            }
            // Fetch admin data here if needed
        } catch (error) {
            console.error('Error checking admin status:', error);
            navigation.replace('Login');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('AdminToken');
            // Use replace instead of navigate to prevent going back
            navigation.replace('MainContainer', { screen: 'Login' });
        } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    const menuItems = [
        { id: 'products', icon: 'cube-outline', label: 'Products', screen: 'ProductManager' },
        { id: 'orders', icon: 'cart-outline', label: 'Orders', screen: 'OrderManager' },
        { id: 'users', icon: 'people-outline', label: 'Users', screen: 'UserManager' },
        // { id: 'categories', icon: 'grid-outline', label: 'Categories', screen: 'CategoryManager' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Pressable onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#FF385C" />
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.menuGrid}>
                    {menuItems.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <Ionicons name={item.icon} size={32} color="#FF385C" />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
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
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
    logoutButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    menuItem: {
        width: '47%',
        aspectRatio: 1,
        backgroundColor: '#FFF0F3',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    menuLabel: {
        marginTop: 12,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
});
