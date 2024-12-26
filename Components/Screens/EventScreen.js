import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EventScreen({ route, navigation }) {
    const [pressed, setpressed] = useState(false);
    const { item } = route.params;
    const [isUser, setisUser] = useState();
    useEffect(() => {
        async function handleToken() {
            let token = await AsyncStorage.getItem("token");
            token == null ? setisUser(false) : setisUser(true);
        }
        handleToken();
    }, [])




    return (
        <GestureHandlerRootView>
            <ScrollView vertical={true} style={{}}>
                <Animated.View entering={FadeInRight}>
                    <StatusBar style="dark" />
                    <View className="relative">
                        <Image source={{ uri: `http://10.0.2.2:3001/images/expositions/${item.image}` }} className="w-full h-80 rounded-lg" />
                        <TouchableOpacity
                            className="absolute top-10 left-2 p-3 rounded-full bg-white opacity-80"
                            onPress={() => navigation.goBack()}
                        >
                            <ChevronLeftIcon size={20} color="#000000" />
                        </TouchableOpacity>
                    </View>
                    <View className="bg-white h-full">
                        <Text className="font-RubikB text-center mt-4 text-2xl uppercase">
                            {item.titre}
                        </Text>
                        <View className="flex flex-colomn items-center opacity-60 space-x-1 self-center my-5">
                            <Ionicons name="location" size={25} className="c-#494C61" color={"#ff9500"} />
                            <Text className="font-RubikR #494C61 mr-2" style={{ marginBottom: 10 }}>
                                {item.location}
                            </Text>
                            <Ionicons name="calendar" size={30} className="#494C61" color={"#ff9500"} />
                            <Text className="font-RubikR #494C61 mr-2" style={{ marginBottom: 10 }}>
                                {new Date(item.dateDebut).getDate() + "/" + new Date(item.dateDebut).getMonth() + "/" + new Date(item.dateDebut).getFullYear() + "\t\t\t\t\t  à\t\t\t\t\t " + new Date(item.dateFin).getDate() + "/" + new Date(item.dateFin).getMonth() + "/" + new Date(item.dateFin).getFullYear()}
                            </Text>
                            <Ionicons name="cash" size={30} className="#494C61" color={"#ff9500"} />
                            <Text className="font-RubikR #494C61 mr-2" style={{ marginBottom: 10 }}>
                                {item.prix == 0 ? "Gratuit" : item.prix + " Dh"}
                            </Text>
                        </View>
                        <Text className="font-RubikR text-lg ml-2">
                            {item.Description}
                        </Text>
                        {/* {pressed && <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#C40C0C' , marginTop: 20, marginLeft: 10, justifyContent: 'center',textAlign:'center',marginRight:10 }}>votre demande est envoyée veuillez attender la confimation</Text>} */}
                        <View style={styles.buttons}>
                            <Pressable style={styles.Long_pressable}  onPress={() => { console.log("pressed") }}>
                                <Text style={styles.Text_pressable} >Localisation</Text>
                            </Pressable>
                        </View>
                        {isUser && <View style={styles.buttons}>
                            <Pressable style={styles.Pressable} onPress={() => { setpressed(true) }}>
                                <Text style={styles.Text_pressable}>Reserver une place</Text>
                            </Pressable>
                            <Pressable style={styles.PressableOfexit} onPress={() => { navigation.goBack() }}>
                                <Text style={styles.Text_pressableOfexit}>Annuler</Text>
                            </Pressable>
                        </View>}
                    </View>
                </Animated.View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    Pressable: {
        backgroundColor: "#ff9500",
        paddingVertical: 10,
        borderRadius: 10,
        alignContent: "center",
        marginHorizontal: 5,
        marginBottom: 30,
        marginTop: 20,
        width: '45%'
    },
    Long_pressable: {
        backgroundColor: "#ff9500",
        paddingVertical: 10,
        borderRadius: 10,
        alignContent: "center",
        marginHorizontal: 5,
        // marginBottom: 30,
        marginTop: 20,
        width: '90%'
    },
    PressableOfexit: {
        backgroundColor: "transparent",
        borderBlockColor: '#000',
        borderLeftWidth: 1,
        borderWidth: 1,
        borderRightWidth: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignContent: "center",
        marginHorizontal: 5,
        marginBottom: 30,
        marginTop: 20,
        width: '45%'
    },
    Text_pressable: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 15,
    }, buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    
    Text_pressableOfexit: {
        textAlign: "center",
        color: "black",
        fontWeight: "bold",
        fontSize: 15,
    }
})