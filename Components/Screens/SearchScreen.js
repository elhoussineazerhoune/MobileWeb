import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Pressable, RefreshControl, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProductPost from '../Common/ProductPost';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();


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
        "idArticle": 1,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p3.jpeg')
    },
    {
        "idArticle": 1,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p4.jpeg')
    },
    {
        "idArticle": 1,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p5.jpeg')
    },
    {
        "idArticle": 1,
        "titre": "T-shirt",
        "description": "T-shirt en coton",
        "prix": 2000,
        "idArtisant": 1,
        "imageUri": require('../../assets/products/p2.jpeg')
    },

]
export default function SearchScreen() {
    const [Data, setData] = useState();
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
            <SafeAreaView>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name='search' size={22} color="#666" />
                        <TextInput 
                            placeholder='Search for clothes, accessories...' 
                            placeholderTextColor="#999"
                            style={styles.searchInput} 
                            onChangeText={(e) => { setInput(e); }}
                        />
                    </View>
                    <Pressable style={styles.filterButton}>
                        <MaterialIcons name="tune" size={22} color="#FF385C" />
                    </Pressable>
                </View>

                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarLabel: ({ focused }) => (
                            <Text style={[
                                styles.tabLabel,
                                focused && styles.tabLabelActive
                            ]}>
                                {route.name}
                            </Text>
                        ),
                        tabBarIcon: ({ focused }) => {
                            let iconName;
                            if (route.name === 'All') iconName = 'grid';
                            else if (route.name === 'Women') iconName = 'woman';
                            else if (route.name === 'Men') iconName = 'man';
                            else if (route.name === 'Kids') iconName = 'people';
                            
                            return <Ionicons 
                                name={iconName} 
                                size={20} 
                                color={focused ? '#FF385C' : '#666'} 
                            />;
                        },
                        tabBarStyle: styles.tabBar,
                        tabBarIndicatorStyle: styles.tabIndicator,
                    })}
                >
                    <Tab.Screen name="All" component={() => { console.log("cickled") }} />
                    <Tab.Screen name="Women" component={() => { console.log("cickled") }} />
                    <Tab.Screen name="Men" component={() => { console.log("cickled") }} />
                    <Tab.Screen name="Kids" component={() => { console.log("cickled") }} />

                </Tab.Navigator>

                <View style={styles.listContainer}>
                    <FlatList 
                        contentContainerStyle={styles.flatListContent}
                        refreshControl={<RefreshControl onRefresh={handleRefresh} />} 
                        data={data} 
                        keyExtractor={(item) => item.idArtisant} 
                        numColumns={3} 
                        showsVerticalScrollIndicator={false} 
                        renderItem={({ item }) => {
                            if (input == "") {
                                return <ProductPost item={item} />;
                            } else if (item.titre.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                                return <ProductPost item={item} />;
                            }
                        }} 
                    />
                </View>

            </SafeAreaView>
        </GestureHandlerRootView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        padding: 12,
        backgroundColor: '#FFF0F3',
        borderRadius: 12,
    },
    tabBar: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tabLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
        marginTop: 4,
    },
    tabLabelActive: {
        color: '#FF385C',
        fontWeight: '600',
    },
    tabIndicator: {
        height: 3,
        borderRadius: 3,
        backgroundColor: '#FF385C',
    },
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
    listContainer: {
        flex: 1,
        height: '76%',
        marginTop: 1,
        alignItems: 'center',
    },
    flatListContent: {
        paddingBottom: 100, // Add padding to account for floating navbar
    },
})