import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

export default function SmallItem({ item }) {
  const navigation = useNavigation();
  return (
    <View
      key={item.id}
      className="bg-white ml-2 rounded-xl overflow-hidden w-[135px] h-[183px] my-1"
      style={{ elevation: 4, position: "relative" }}
    >
      <Pressable onPress={() => {
        navigation.navigate('category', { categorie: item.titre });
      }}
        style={{ marginRight: 3 }}>
        {/* <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 0.8 }}
          colors={['#E2C799', '#ffffff']}
          style={{ flexDirection: 'column', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}> */}

        <Image
          source={item.imageUri}
          style={{ width: "100%", height: "100%", alignSelf: "center", resizeMode: "cover" }} />


        <Text style={styles.titre}>{item.titre}</Text>

        {/* </LinearGradient> */}
      </Pressable>

    </View>
  );
}
const styles = StyleSheet.create({
  titre: {
    fontFamily: 'Rubik-Regular',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 15,
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    color: "white",
    zIndex: 10,
    padding: 5,
    backgroundColor: "rgba(156, 156, 156, 0.8)",
    marginHorizontal: 10,
    borderRadius: 5
  }
})



