import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from "react-native-vector-icons/Ionicons"
import Animated, { FadeInDown } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

export default function SettingsScreen({ navigation }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('ClientToken');
            if (token) {
                setIsAuthenticated(true);
                // Fetch user data from the API
                axios.post("http://10.0.2.2:3306/api/client/findcurrentclient", { id: token })
                    .then((res) => {
                        if (res.data.error) {
                            console.warn(res.data.error);
                        } else {
                            const user = res.data.user;
                            setUserData({
                                name: `${user.nom} ${user.prenom}`,
                                email: user.email,
                                image: user.image || require('../../assets/images/img1.jpeg') // fallback image
                            });
                            // Store user data in AsyncStorage for persistence
                            AsyncStorage.setItem('UserData', JSON.stringify(user));
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to fetch user data:', error);
                    });
            } else {
                setIsAuthenticated(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Check auth status when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            checkAuthStatus();
        }, [])
    );

    // Initial check
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('ClientToken');
            await AsyncStorage.removeItem('UserData');
            setIsAuthenticated(false);
            setUserData(null);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleRegister = () => {
        navigation.navigate('Sign Up');
    };

    const guestOptions = [
        { icon: 'help-circle-outline', title: 'Help', subtitle: 'FAQ and support' },
        { icon: 'information-circle-outline', title: 'About', subtitle: 'App information' },
        { icon: 'language-outline', title: 'Language', subtitle: 'Change app language' },
    ];

    const authOptions = [
        { icon: 'person-outline', title: 'Account', subtitle: 'Personal information' },
        { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Customize notifications' },
        { icon: 'lock-closed-outline', title: 'Privacy', subtitle: 'Security settings' },
        ...guestOptions
    ];

    const renderGuestHeader = () => (
        <Animated.View 
            entering={FadeInDown.duration(400)}
            style={styles.guestHeader}
        >
            <Text style={styles.guestTitle}>Welcome to Our App</Text>
            <Text style={styles.guestSubtitle}>Sign in to access all features</Text>
            <View style={styles.authButtons}>
                <Pressable style={[styles.authButton, styles.loginButton]} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                </Pressable>
                <Pressable style={[styles.authButton, styles.registerButton]} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Create Account</Text>
                </Pressable>
            </View>
        </Animated.View>
    );

    const renderAuthenticatedHeader = () => (
        <Animated.View 
            entering={FadeInDown.duration(400)}
            style={styles.profileSection}
        >
            <View style={styles.profileHeader}>
                <Image 
                    source={userData?.image} 
                    style={styles.profileImage} 
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{userData?.name}</Text>
                    <Text style={styles.profileEmail}>{userData?.email}</Text>
                </View>
                <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
                    <Ionicons name="create-outline" size={24} color="#FF385C" />
                </Pressable>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </Pressable>
                <Text style={styles.headerTitle}>Settings</Text>
                <Pressable style={styles.placeholderButton}>
                    <Text> </Text>
                </Pressable>
            </View>
            
            {isAuthenticated ? renderAuthenticatedHeader() : renderGuestHeader()}

            <View style={styles.settingsSection}>
                {(isAuthenticated ? authOptions : guestOptions).map((option, index) => (
                    <Animated.View 
                        key={option.title}
                        entering={FadeInDown.duration(400).delay(index * 100)}
                    >
                        <Pressable 
                            style={styles.settingsItem}
                            onPress={() => navigation.navigate(option.title)}
                        >
                            <View style={styles.settingsItemLeft}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name={option.icon} size={24} color="#FF385C" />
                                </View>
                                <View style={styles.settingsItemText}>
                                    <Text style={styles.settingsItemTitle}>{option.title}</Text>
                                    <Text style={styles.settingsItemSubtitle}>{option.subtitle}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#666" />
                        </Pressable>
                    </Animated.View>
                ))}
            </View>

            {isAuthenticated && (
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FFF" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    profileSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    profileEmail: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    editButton: {
        padding: 8,
    },
    settingsSection: {
        paddingTop: 20,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingsItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff0f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingsItemText: {
        flex: 1,
    },
    settingsItemTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#333',
    },
    settingsItemSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF385C',
        marginHorizontal: 20,
        marginVertical: 20,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    guestHeader: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    guestTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginBottom: 8,
    },
    guestSubtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        marginBottom: 20,
    },
    authButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    authButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#FF385C',
    },
    registerButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FF385C',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    registerButtonText: {
        color: '#FF385C',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
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
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
    },
    backButton: {
        padding: 8,
    },
    placeholderButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});