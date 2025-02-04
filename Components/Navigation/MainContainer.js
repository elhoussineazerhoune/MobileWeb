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
import AsyncStorage from "@react-native-async-storage/async-storage";

const homename = "Home";
const SettingsName = "Settings";
const DetailsName = "Details";
const searchName = "Search";
const LoginName = "Login";

const { width } = Dimensions.get('window');

const Tab = createBottomTabNavigator();
export default function MainContainer() {
    const [token, setToken] = useState();

    async function handleToken() {
        const token = await AsyncStorage.getItem("ClientToken");
        setToken(token);
    }
    handleToken();
    return (
        <Tab.Navigator
            initialRouteName={homename}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homename) {
                        iconName = focused ? "home" : "home-outline";
                    } else if (rn === DetailsName) {
                        return <MaterialCommunityIcons name="nfc-variant" size={30} color={color} />;
                    } else if (rn === SettingsName) {
                        iconName = focused ? "settings" : "settings-outline";
                    } else if (rn === searchName) {
                        iconName = focused ? "search" : "search-outline";
                    } else if (rn === LoginName) {
                        if (focused) {
                            iconName = token ? "person" : "log-in";
                        } else {
                            iconName = token ? "person-outline" : "log-in-outline";
                        }
                    }
                    return (
                        <Ionicons 
                            name={iconName} 
                            size={24} 
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
                component={token ? ProfileScreen : LoginScreen}
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
