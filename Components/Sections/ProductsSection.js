import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import SmallButton from "../Common/SmallButton";
import ProductCard from "../Common/ProductCard";
import { FlatList } from "react-native-gesture-handler";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
const data = [
    {
        id: "1",
        name: "Nike Shoe",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p2.jpeg"),
        isFavorite: true,
    },
    {
        id: "2",
        name: "Sneakers ft",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p3.jpeg"),
        isFavorite: false,
    },
    {
        id: "3",
        name: "Sneakers ft",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p4.jpeg"),
        isFavorite: false,
    },
    {
        id: "4",
        name: "Sneakers ft",
        price: "85$",
        rating: "4.8",
        imageUri: require("../../assets/products/p5.jpeg"),
        isFavorite: false,
    },

];

const renderItem = ({ item }) => (
    <View style={styles.card}>
        {/* Image */}
        <Image source={item.imageUri} style={styles.image} resizeMode="cover" />

        {/* Favorite Icon */}
        {/* <TouchableOpacity style={styles.favoriteIcon}>
            <Ionicons name={item.isFavorite ? "heart" : "heart-outline"} size={20} color={item.isFavorite ? "red" : "gray"} />
        </TouchableOpacity> */}

        {/* Product Info */}
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'90%'}}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price}</Text>
        </View>

        <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="gold" />
            <Text style={styles.rating}>{item.rating}</Text>
        </View>
    </View>
);

export default function ProductsSection() {
    // const navigation = useNavigation();
    // const [products, setProducts] = useState();
    // const [isConnected, setIsConnected] = useState(false);
    // function handleProducts() {
    //     axios.post("http://10.0.2.2:3001/allProducts").then((res) => {
    //         if (res.data.error) {
    //             console.warn(res.data.error);
    //         } else {
    //             // console.log(res.data);
    //             let articles = res.data;
    //             setProducts(articles.sort((a, b) => b.idArticle - a.idArticle).slice(0, 3));
    //             setIsConnected(true);
    //         }
    //     })
    // }
    // useEffect(() => {
    //     handleProducts();

    // }, []);
    // if (!isConnected) {
    //     return (
    //         <View></View>
    //     )
    // }
    return (
        <Animated.View entering={FadeInRight.duration(700)} className='mb-[70px]'>
            <View className="flex flex-row mt-6">
                <Text className="font-[Rubik-SemiBold] text-xl my-3 ml-3 flex-1">
                    Suggestions
                </Text>
                <View className="mr-3">
                    <SmallButton onPress={() => navigation.navigate("Search")}>
                        Voir plus
                    </SmallButton>
                </View>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true}
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}
            />
        </Animated.View>
    );
}
const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    card: {
        flex: 1,
        marginHorizontal: 7,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        alignItems: "center",
        minWidth:100,
        maxWidth:150
    },
    image: {
        width: "100%",
        height: 100,
        marginBottom: 10,
        borderTopLeftRadius:5,
        borderTopRightRadius:5
    },
    favoriteIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(178, 178, 178, 0.4)",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
        maxWidth:"70%",
        overflow:'hidden'
    },
    price: {
        fontSize: 14,
        color: "#555",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    rating: {
        marginLeft: 5,
        fontSize: 14,
        color: "#555",
    },
});

