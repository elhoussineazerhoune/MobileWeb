import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import Ionicons from "react-native-vector-icons/Ionicons";
import ProductPost from '../Common/ProductPost';


export default function SearchScreen() {
    const [data, setData] = useState();
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
    if (!isConnected) {
        return (
            <View className="h-screen items-center justify-center">
                <ActivityIndicator size='' color='#4D2222' />
            </View>
        )
    }
    return (
        <GestureHandlerRootView className="bg-[#F5F5F5]">
            <SafeAreaView >
                <View className='w-[80%] p-1 mt-8 self-center bg-[white] flex-row' style={{ borderRadius: 40, borderWidth: 1, borderBlockColor: 'grey' }}>
                    <TextInput className="w-[90%] ml-1" placeholder='Recherche' onChangeText={(e) => { setInput(e); }} />
                    <Ionicons name='search' size={25} />
                </View>
                <View className="w-full h-[87%] mt-5  items-center">
                    <FlatList refreshControl={<RefreshControl onRefresh={handleRefresh} />} data={data} keyExtractor={(item) => item.idArtisant} numColumns={3} showsVerticalScrollIndicator={false} renderItem={({ item }) => {
                        if (input == "") {
                            return <ProductPost item={item} />;
                        } else if (item.titre.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
                            return <ProductPost item={item} />;
                        }
                    }} />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}