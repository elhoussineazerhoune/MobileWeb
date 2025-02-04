import { View, Text, Pressable } from "react-native";
import React from "react";

export default function SmallButton(props) {
  return (
    <Pressable
      className="bg-[#59D6FF] w-20 h-8 pl-2 pr-2 flex justify-center items-center rounded-full"
      
      onPress={props.onPress}
      style={{ marginTop: 5 }}
    >
      <Text className="text-[#F8F8F8] font-RubikR text-[14px]">{props.children || "Press me"}</Text>
    </Pressable>
  );
}
