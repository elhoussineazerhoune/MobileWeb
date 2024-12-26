import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Screens
import HomeScreen from "../Screens/HomeScreen";
import SettingsScreen from "../Screens/SettingsScreen";
import ScannerScreen from "../Screens/NfcScannerScreen";
import SearchScreen from "../Screens/SearchScreen";
import LoginScreen from "../Screens/LoginScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const homename = "Home";
const SettingsName = "Settings";
const DetailsName = "Details";
const searchName = "Search";
const LoginName = "Login";

const Tab = createBottomTabNavigator();
export default function MainContainer() {
    const [token, setToken] = useState();

    async function handleToken() {
        const token = await AsyncStorage.getItem("token");
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
                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    position: "absolute",
                    margin: 20,
                    borderRadius: 13,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.85)",
                    overflow: "hidden",
                },
                tabBarActiveTintColor: "#59D6FF",
                tabBarInactiveTintColor: "gray",
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
