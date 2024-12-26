import { View, Text, Pressable, Image, StyleSheet, TextInput } from "react-native";
import React from "react";
import Events from "../Sections/Events";
import { ChevronDownIcon } from "react-native-heroicons/solid";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoriesSection from "../Sections/CategoriesSection";
import {
    GestureHandlerRootView,
    RefreshControl,
    ScrollView,
} from "react-native-gesture-handler";
import ProductsSection from "../Sections/ProductsSection";
import Animated, { FadeInLeft } from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";
import SmallButton from "../Common/SmallButton";

export default function HomeScreen({ navigation }) {
    return (
        <GestureHandlerRootView>
            <SafeAreaView className="mb-15">
                <StatusBar backgroundColor='#F5F5F5' style="dark" />
                <ScrollView className="bg-white mb-15" showsVerticalScrollIndicator={false}>
                    <Animated.Text className="font-RubikM text-2xl mt-10 ml-3 mb-3" entering={FadeInLeft.duration(500)}>
                        Be Stylish at every moment
                    </Animated.Text>
                    <Pressable onPress={() => { navigation.navigate('Search') }}>
                        <View style={styles.rechercheView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons name='search' size={25} />
                                <TextInput placeholder='Recherche' style={styles.recherche} readOnly />
                            </View>
                        </View>
                    </Pressable>
                    <CategoriesSection />
                    <ProductsSection type={"Suggestions"}/>
                    <ProductsSection type={"Snickers"}/>
                    <ProductsSection type={"MenWears"}/>

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
})