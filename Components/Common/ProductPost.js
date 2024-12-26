import { View, Text, StyleSheet, Dimensions, Image, Pressable } from 'react-native'
import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 20) / 3;
export default function ProductPost({ item }) {
    const navigation = useNavigation();
    return (
        <View style={styles.item}>
            <Pressable onPress={() => { navigation.navigate("Product", { produit: item }) }}>
                <View style={styles.imageContainer}>
                    <Image source={item.imageUri} style={styles.image} />
                </View>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        position: 'relative'
    },
    imageContainer: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        overflow: "hidden",
        position: 'relative'
    },
    item: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        margin: 3
    },
})