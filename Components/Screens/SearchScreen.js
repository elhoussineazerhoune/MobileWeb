import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
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
        <GestureHandlerRootView className="bg-[#F5F5F5] pt-3">
            <SafeAreaView >
                <Pressable >
                    <View style={styles.rechercheView}>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <Ionicons name='search' size={25} />
                            <TextInput placeholder='Recherche' style={styles.recherche} onChangeText={(e) => { setInput(e); }} />
                        </View>
                    </View>
                </Pressable>

                <Tab.Navigator
                    // initialRouteName={HomeRoute}
                    screenOptions={({ route }) => ({
                        tabBarLabel: route.name,
                        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
                        tabBarStyle: styles.tabBar,
                        tabBarActiveTintColor: '#486FFB',
                        tabBarInactiveTintColor: 'gray',
                        tabBarIndicatorStyle: {
                            height: 1,
                            backgroundColor: '#486FFB',
                        },
                        // tabBarIconStyle: {
                        //     marginHorizontal: 20,
                        //     width: "auto",
                        //     height: 100
                        // },
                        // tabBarGap: 120,
                        tabBarItemStyle: {
                            justifyContent: "space-between",
                            marginHorizontal: 0,
                        },
                    })}
                >
                    <Tab.Screen name="All" component={() => { console.log("cickled") }} />
                    <Tab.Screen name="Women" component={() => { console.log("cickled") }} />
                    <Tab.Screen name="Men" component={() => { console.log("cickled") }} />
                    <Tab.Screen name="Kids" component={() => { console.log("cickled") }} />

                </Tab.Navigator>




                <View className="w-full h-[76%] mt-1  items-center">
                    <FlatList refreshControl={<RefreshControl onRefresh={handleRefresh} />} data={data} keyExtractor={(item) => item.idArtisant} numColumns={3} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
                        if (input == "") {
                            return <ProductPost item={item} />;
                        } else if (item.titre.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                            return <ProductPost item={item} />;
                        }
                    }} />
                </View>

            </SafeAreaView>
        </GestureHandlerRootView >
    )
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
    tabBar: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        height: 100,
        width: "100%",
        paddingHorizontal: 0,
        justifyContent: "space-between",
        marginTop: 20
    },
})