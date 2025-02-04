import { View, Text, Pressable, Image, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoriesSection from "../Sections/CategoriesSection";
import { GestureHandlerRootView, RefreshControl, ScrollView } from "react-native-gesture-handler";
import ProductsSection from "../Sections/ProductsSection";
import Animated, { FadeInLeft } from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";
import Posts from "../Sections/Posts";
import axios from "axios";
import { useEffect } from "react";
import { useCart } from '../../context/CartContext';

const getCategories = async () => {
    await axios.get("http://10.0.2.2:8080/api/categories").then(
        (res) => {
            console.log("data is :" + res);
        }
    );
}
export default function HomeScreen({ navigation }) {
    const { cartCount } = useCart();

    useEffect(() => {
        getCategories();
    }, [])
    
    return (
        <GestureHandlerRootView>
            <SafeAreaView className="mb-15">
                <StatusBar backgroundColor='transparent' style="dark" />
                <ScrollView className="bg-white mb-15" showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Animated.Text 
                                style={styles.welcomeText} 
                                entering={FadeInLeft.duration(500)}
                            >
                                Welcome to
                            </Animated.Text>
                            <Animated.Text 
                                style={styles.mainTitle}
                                entering={FadeInLeft.duration(500).delay(100)}
                            >
                                Be Stylish at every moment
                            </Animated.Text>
                        </View>
                        <Pressable onPress={() => navigation.navigate('Cart')} style={styles.cartButton}>
                            <Ionicons name='cart-outline' size={28} color="#333" />
                            {cartCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    <Pressable 
                        onPress={() => navigation.navigate('Search')}
                    >
                        <View style={styles.searchBox}>
                            <Ionicons name='search' size={25} color="#666" />
                            <Text style={styles.searchPlaceholder}>Search for products...</Text>
                        </View>
                    </Pressable>

                    <CategoriesSection />
                    <ProductsSection type={"Suggestions"} />

                    {/* <Posts /> */}

                    <ProductsSection type={"Snickers"} />
                    <ProductsSection type={"MenWears"} />

                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
const styles = StyleSheet.create({
    rechercheView: {
        borderRadius: 15,
        borderBlockColor: 'grey',
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10,
        borderWidth: 0,
        elevation: 10,
        width: "90%",
        justifyContent: 'space-between'
    },
    recherche: {
        paddingLeft: 20,
        fontSize: 20,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
    },
    titleContainer: {
        flex: 1,
        marginLeft: 20,
        marginTop: 20,
    },
    welcomeText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    mainTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#333',
        lineHeight: 32,
    },
    searchContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchPlaceholder: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#666',
        marginLeft: 12,
    },
    cartButton: {
        position: 'relative',
        padding: 12,
    },
    badge: {
        position: 'absolute',
        right: 4,
        top: 4,
        backgroundColor: '#FF385C',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        fontSize: 12,
    },
});