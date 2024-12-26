import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function ProductCard({ item }) {

    const navigation = useNavigation();
    return (
        <Pressable onPress={() => { navigation.push("Product", { produit: item }) }} key={item.id} className="w-[271px] h-auto bg-white rounded-xl ml-2 mb-6" style={{ elevation: 2 }}>
            <Image
                // source={{uri: "http://10.0.2.2:3001/images/pro1.png"}}
                source={{ uri: `http://10.0.2.2:3001/images/${item.image}` }}
                className="w-[271px] h-[122px] rounded-t-lg"
            />
            <Text className="font-RubikM ml-5 mt-3 text-[18px]">{item.titre}</Text>
            <Text className="font-RubikR ml-5 mt-1 text-[12px] text-[#494C61]">{item.description.length > 50 ? item.description.substring(0, 50) + "..." : item.description}</Text>
            <View className="flex-row items-center ml-4 space-x-1" style={{ alignItems: 'center' }}>
                {/* <Ionicons name="location" size={16} className="text-[#494C61]" />
                <Text className="text-[#494C61] font-RubikR mr-2">{item.ville}</Text> */}
                <Ionicons name="cash" size={16} className="text-[#494C61]" />
                <Text className="text-[#494C61] font-RubikR ">{item.prix} Dh</Text>
            </View>
        </Pressable>
    );
}




