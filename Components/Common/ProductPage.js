import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    GestureHandlerRootView,
    NativeViewGestureHandler,
    ScrollView,
} from "react-native-gesture-handler";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import ProductCard from "./ProductCard";
import { FlatList } from "react-native-gesture-handler";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";


function formatDate(dateString) {
    console.log(dateString);
    let date = new Date(dateString);
    let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
}

export default function ProductPage({ route, navigation }) {
    const { produit, tagId } = route.params;
    const [artisant, setArtisant] = useState();
    const [product, setProduct] = useState(produit);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState();
    const [modeNonConnecte, setModeNonConnecte] = useState(false);
    const [isAuthentic, setIsAuthentic] = useState(false);

    async function handleArtisant() {
        const idArtisant = produit.idArtisant;
        await axios.post("http://10.0.2.2:3001/getArtisant", { idArtisant }, { timeout: 5000 })
            .then(async (res) => {
                if (res.data.error) {
                    console.log(res.data.error);
                    return 0;
                } else {
                    setArtisant(res.data);
                    await handleProducts();
                    setIsLoading(false);
                    return 1;
                }
            }).catch((e) => {
                console.log(e);
                setModeNonConnecte(true);
                setIsLoading(false);
                console.log("Vous etes en mode non Connecté");
                return 1;
            });
    }

    async function handleProducts() {
        const idArtisant = produit.idArtisant;
        const idArticle = produit.idArticle;
        // console.log(idArticle);
        await axios.post("http://10.0.2.2:3001/productsByArtisant", { idArtisant }, { timeout: 5000 }).then(async (res) => {
            if (res.data.error) {
                console.warn(res.data.error);
            } else {
                console.log("item: ", res.data.filter((product) => product.idArticle == idArticle));
                setProduct(res.data.filter((product) => product.idArticle == idArticle)[0])
                setIsAuthentic(res.data.filter((product) => product.idArticle == idArticle)[0].tagId == tagId);
                console.log("test");
                setProducts(res.data.filter((product) => product.idArticle != idArticle));
                // console.log(isAuthentic);
            }
        }).catch((e) => {
            console.log("1 ", e);
            //mode Non Connécté
            setModeNonConnecte(true);
            setIsLoading(false);
            console.log("Vous etes en mode non Connecté");
        });
    }
    useEffect(() => {
        handleArtisant().then(() => {
            console.log(product.image);
            setIsLoading(false);
        });
    }, [isAuthentic])
    if (isLoading) {
        return (
            <View className="h-screen items-center justify-center">
                <ActivityIndicator size='' color='#4D2222' />
            </View>
        )
    }
    if (tagId && modeNonConnecte) {
        return (
            <View>
                <StatusBar style="dark" />
                <View className="relative">
                    <Image
                        source={require("../../assets/images/noPhoto.jpg")}
                        className="w-full h-80 rounded-lg"
                    />
                    <TouchableOpacity
                        className="absolute top-10 left-2 p-3 rounded-full bg-white opacity-80"
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeftIcon size={20} color="#000000" />
                    </TouchableOpacity>
                </View>
                <View className="py-2 w-full bg-yellow-400">
                    <Text className="self-center text-white font-RubikB">ATTENTION</Text>
                    <Text className="self-center text-white font-RubikB">Vous êtes en mode non Connecté</Text>
                </View>
                <View className="bg-white h-screen">
                    <Text className="font-RubikB text-center mt-4 text-2xl uppercase">
                        {produit.titre}
                    </Text>
                    <View className="flex flex-row items-center opacity-60 space-x-1 self-center my-2">
                        <Ionicons
                            name="calendar"
                            size={30}
                            className="#494C61"
                        />
                        <Text className="font-RubikR #494C61 mr-2">
                            De {formatDate(produit.dateDebut)} à {formatDate(produit.dateFin)}
                        </Text>
                        <Ionicons
                            name="cash"
                            size={30}
                            className="#494C61"
                        />
                        <Text className="font-RubikR #494C61 mr-2">
                            {produit.prix == 0
                                ? "Gratuit"
                                : produit.prix + " Dh"}
                        </Text>
                    </View>
                    <Text className="font-RubikR text-lg ml-2 pl-2">
                        Fabriqué par:
                    </Text>
                    <View className="bg-orange-500 rounded-xl w-[50%]  self-center mt-10">
                        <Image
                            source={require("../../assets/images/profile.png")}
                            className="absolute top-[-50px] self-center w-20 h-20 bg-white rounded-full"
                        />
                        <Text className=" self-center mt-10 font-RubikM text-white text-lg">
                            {produit.nomArtisant}
                        </Text>
                        <View className="self-center">
                            <View className="flex-row">
                                <Ionicons
                                    name="call"
                                    size={25}
                                    className="text-white inline"
                                    style={{ color: 'white' }}
                                />
                                <Text className="text-white font-RubikL mb-3">
                                    : {produit.contactArtisant}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
    return (
        <GestureHandlerRootView>
            <ScrollView>
                <StatusBar style="dark" />
                <View className="relative">
                    <Image
                        // source={{ uri: "http://10.0.2.2:3001/images/pro_1714837762754.jpg" }}
                        source={{ uri: `http://10.0.2.2:3001/images/${product.image}` }}
                        className="w-full h-80 rounded-lg"
                    />
                    <TouchableOpacity
                        className="absolute top-10 left-2 p-3 rounded-full bg-white opacity-80"
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeftIcon size={20} color="#000000" />
                    </TouchableOpacity>
                </View>
                <View className="bg-white">
                    <Text className={"text-white text-center w-full font-RubikB " + (tagId && isAuthentic ? "py-2 bg-green-400" : tagId ? "py-2 bg-red-500" : "hidden")} >{tagId && isAuthentic ? "votre produit est authentique" : tagId ? "Attention:\nVotre produit n'est pas authentique" : ""}</Text>
                    <Text className="font-RubikB text-center mt-4 text-2xl uppercase">
                        {produit.titre}
                    </Text>
                    <View className="flex flex-row items-center opacity-60 space-x-1 self-center my-2">
                        <Ionicons
                            name="calendar"
                            size={30}
                            className="#494C61"
                            style={{ color: '#002379' }}
                        />
                        <Text className="font-RubikR #494C61 mr-2">
                            De {formatDate(produit.dateDebut)} à {formatDate(produit.dateFin)}
                        </Text>
                        <Ionicons
                            name="cash"
                            size={30}
                            className="#494C61"
                            style={{ color: '#002379' }}
                        />
                        <Text className="font-RubikR #494C61 mr-2">
                            {produit.prix == 0
                                ? "Gratuit"
                                : produit.prix + " Dh"}
                        </Text>
                    </View>
                    <View style={{ marginTop: 20, marginleft: 10 }}>
                        <View style={{ flexDirection: 'row', marginleft: 10 }}>
                            <Ionicons name="create" size={25} className="text-white inline" style={{ color: '#002379' }} />
                            <Text className="font-RubikR text-lg ml-2 pl-2" style={{ color: '#002379', fontWeight: 'bold' }}>Description :</Text>
                        </View>
                        <Text className="font-RubikR text-md text-center mt-2">{product.description}</Text>
                    </View>
                    <View style={{ marginTop: 20, marginleft: 10 }}>
                        <View style={{ flexDirection: 'row', marginleft: 10 }}>
                            <Ionicons name="checkbox" size={25} className="text-white inline" style={{ color: '#002379' }} />
                            <Text className="font-RubikR text-lg ml-2 pl-2" style={{ color: '#002379', fontWeight: 'bold' }}>matière premiere :</Text>
                        </View>
                        <Text className="font-RubikR text-md text-center" style={{ marginBottom: 10, marginTop: 10 }}>{product.matierePremiere}</Text>
                    </View>
                    <Text className="font-RubikR text-lg ml-2 pl-2">
                        Fabriqué par:
                    </Text>
                    <View className="bg-orange-500 rounded-xl w-[50%]  self-center mt-10">
                        <Image
                            source={require("../../assets/images/profile.png")}
                            className="absolute top-[-50px] self-center w-20 h-20 bg-white rounded-full"
                        />
                        <Text className=" self-center mt-10 font-RubikM text-white text-lg">
                            {artisant.firstname} {artisant.lastname}
                        </Text>
                        <View className="self-center">
                            <View className="flex flex-row">
                                <Ionicons
                                    name="location"
                                    size={25}
                                    className="text-white inline"
                                    style={{ color: 'white' }}
                                />
                                <Text className="text-white font-RubikL">
                                    : {artisant.adresse}
                                </Text>
                            </View>
                            <View className="flex-row">
                                <Ionicons
                                    name="call"
                                    size={25}
                                    className="text-white inline"
                                    style={{ color: 'white' }}
                                />
                                <Text className="text-white font-RubikL mb-3">
                                    : {artisant.phone}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text className="ml-2 text-lg mt-3 font-RubikB">
                        Autre Produits par le meme artisant
                    </Text>
                    <FlatList
                        data={products}
                        horizontal
                        keyExtractor={(item) => item.idArticle}

                        renderItem={({ item }) => <ProductCard item={item} />}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

