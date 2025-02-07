import React, { useEffect, useState } from "react";
import { Platform, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";

// Screens
import HomeScreen from "../Screens/HomeScreen";
import SettingsScreen from "../Screens/SettingsScreen";
import SearchScreen from "../Screens/SearchScreen";
import LoginScreen from "../Screens/LoginScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import AdminDashboard from "../Screens/AdminDashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const homename = "Home";
const SettingsName = "Settings";
const searchName = "Search";
const LoginName = "Login";

const { width } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
export default function MainContainer({ navigation }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const adminToken = await AsyncStorage.getItem("AdminToken");
            if (adminToken) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AdminDashboard' }]
                });
                return;
            }
            
            const clientToken = await AsyncStorage.getItem("ClientToken");
            setIsAuthenticated(!!clientToken);
        } catch (error) {
            console.error('Error checking authentication status:', error);
            setIsAuthenticated(false);
        }
    };

    return (
        <Tab.Navigator
            initialRouteName={homename}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homename) {
                        iconName = focused ? "home-sharp" : "home-outline";
                    } else if (rn === searchName) {
                        iconName = focused ? "compass" : "compass-outline";
                    } else if (rn === SettingsName) {
                        iconName = focused ? "settings" : "settings-outline";  // Changed from grid to apps
                    } else if (rn === LoginName) {
                        iconName = focused 
                            ? (isAuthenticated ? "person-circle" : "log-in")
                            : (isAuthenticated ? "person-circle-outline" : "log-in-outline");
                    }
                    return (
                        <Ionicons 
                            name={iconName} 
                            size={rn === LoginName ? 28 : 24} 
                            color={color}
                            style={{
                                transform: [{ scale: focused ? 1.2 : 1 }],
                            }}
                        />
                    );
                },
                headerShown: false,
                tabBarStyle: {
                    height: 60, // Slightly reduced height
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 34 : 24, // Increased bottom margin
                    left: 16,
                    right: 16,
                    borderRadius: 20,
                    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : 'white',
                    borderTopWidth: 0,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    paddingTop: 10,
                },
                tabBarBackground: Platform.OS === 'ios' ? () => (
                    <BlurView
                        tint="light"
                        intensity={80}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 20,
                        }}
                    />
                ) : undefined,
                tabBarActiveTintColor: "#FF385C",
                tabBarInactiveTintColor: "#858585",
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    padding: 4,
                },
                tabBarIconStyle: {
                    transform: [{ translateY: -2 }],
                },
            })}
        >
            <Tab.Screen
                name={homename}
                component={HomeScreen}
                options={{ tabBarShowLabel: false }}
            />
            <Tab.Screen
                name={searchName}
                component={SearchScreen}
                options={{ tabBarShowLabel: false }}
            />
            <Tab.Screen
                name={LoginName}
                component={isAuthenticated ? ProfileScreen : LoginScreen}
                listeners={{
                    tabPress: () => {
                        // Force a re-check of auth status when tab is pressed
                        checkAuthStatus();
                    },
                }}
                options={{ tabBarShowLabel: false }}
            />
            <Tab.Screen
                name={SettingsName}
                component={SettingsScreen}
                options={{ tabBarShowLabel: false }}
            />
        </Tab.Navigator>
    );
}
