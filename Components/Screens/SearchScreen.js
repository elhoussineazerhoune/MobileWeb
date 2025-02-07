import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import ProductPost from '../Common/ProductPost';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Animated, { FadeInDown } from 'react-native-reanimated';
const Tab = createMaterialTopTabNavigator();

const categories = [
    { name: "All", icon: "grid-outline" },
    { name: "Women", icon: "woman-outline" },
    { name: "Men", icon: "man-outline" },
    { name: "Kids", icon: "people-outline" },
];

const data = [
    {
        "idArticle": 1,
        "titre": "A-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p2.jpeg')
    },
    {
        "idArticle": 2,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p3.jpeg')
    },
    {
        "idArticle": 3,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p4.jpeg')
    },
    {
        "idArticle": 4,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p5.jpeg')
    },
    {
        "idArticle": 5,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p2.jpeg')
    },

]
export default function SearchScreen({ navigation }) { // Add navigation prop
    const [Data, setData] = useState(data);
    const [isConnected, setIsConnected] = useState(false);
    const [input, setInput] = useState("");
    function handleProducts() {
        axios.post("http://10.0.2.2:3001/allProducts").then((res) => {
            // console.log(res.data);
            if (res.data.error) {
                console.warn(res.data.error);
            } else {
                // console.log(res.data);
                setData(res.data.sort((a, b) => b.idArticle - a.idArticle));
                setIsConnected(true);
            }
        })
    }
    function handleRefresh() {
        setIsConnected(false);
        handleProducts();
    }
    useEffect(() => { handleProducts() }, [])
    // console.log(input);
    // if (!isConnected) {
    //     return (
    //         <View className="h-screen items-center justify-center">
    //             <ActivityIndicator size='' color='#4D2222' />
    //         </View>
    //     )
    // }
    return (
        <GestureHandlerRootView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Search Header */}
                <Animated.View 
                    entering={FadeInDown.duration(400)}
                    style={styles.searchHeader}
                >
                    <View style={styles.headerContainer}>
                        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </Pressable>
                        <View style={styles.searchBox}>
                            <Ionicons name='search' size={22} color="#FF385C" />
                            <TextInput 
                                placeholder='What are you looking for?' 
                                style={styles.searchInput} 
                                onChangeText={setInput}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>
                </Animated.View>

                {/* Categories Tabs */}
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarLabel: ({ focused }) => (
                            <View style={styles.tabContent}>
                                <Ionicons 
                                    name={categories.find(cat => cat.name === route.name)?.icon} 
                                    size={20} 
                                    color={focused ? '#FF385C' : '#666'} 
                                />
                                <Text style={[
                                    styles.tabLabel,
                                    focused && styles.tabLabelActive
                                ]}>
                                    {route.name}
                                </Text>
                            </View>
                        ),
                        tabBarStyle: styles.tabBar,
                        tabBarIndicatorStyle: styles.tabIndicator,
                        tabBarItemStyle: styles.tabItem,
                        tabBarScrollEnabled: true,
                    })}
                >
                    {categories.map(category => (
                        <Tab.Screen 
                            key={category.name} 
                            name={category.name} 
                            component={ProductListComponent} 
                        />
                    ))}
                </Tab.Navigator>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const ProductListComponent = () => (
    <View style={styles.productsContainer}>
        <FlatList 
            data={data}
            keyExtractor={(item) => item.idArticle.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsList}
            renderItem={({ item }) => (
                <ProductPost item={item} />
            )}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    searchHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 8,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Poppins-Regular',
    },
    tabBar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        shadowOpacity: 0,
        height: 70, // Increased height to accommodate vertical layout
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        justifyContent: 'space-between', // Add this to distribute tabs evenly
    },
    tabContent: {
        flexDirection: 'column', // Changed to column for vertical layout
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4, // Reduced gap between icon and text
        paddingVertical: 8,
    },
    tabLabel: {
        fontSize: 12, // Slightly smaller font for better fit
        fontFamily: 'Poppins-Medium',
        color: '#666',
    },
    tabLabelActive: {
        color: '#FF385C',
        fontFamily: 'Poppins-SemiBold',
    },
    tabIndicator: {
        backgroundColor: '#FF385C',
        height: 3,
        borderRadius: 3,
    },
    tabItem: {
        width: Dimensions.get('window').width / 4, // Set each tab to 1/4 of screen width
        padding: 0,
        paddingHorizontal: 0, // Remove horizontal padding
    },
    productsContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
        paddingHorizontal: 8, // Add horizontal padding for spacing
    },
    productsList: {
        paddingBottom: 20, // Add some bottom padding for better scrolling
    },
});