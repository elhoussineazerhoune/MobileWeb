import { View, Text, Pressable } from "react-native";
import React from "react";

export default function SmallButton(props) {
  return (
    <Pressable
      className="bg-[#59D6FF] w-20 h-8 pl-2 pr-2 flex justify-center items-center rounded-full"
      
      onPress={props.onPress}
      style={{ marginTop: 5 }}
    >
      <Text className="text-[#4D2222] font-RubikR text-[15px]">{props.children || "Press me"}</Text>
    </Pressable>
  );
}
