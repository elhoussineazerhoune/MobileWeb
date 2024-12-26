import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function EventCard({ imgUrl, title }) {
  return (
    <Pressable className="mt-10 mr-5 flex justify-end items-center">
      <Image source={uri = imgUrl} className="h-[150px] w-[200px] rounded-xl" />
      <Image source={uri = require("../../assets/gradient.png")} className="h-[150px] w-[200px] absolute" />
      <Text className="absolute text-white bottom-5 font-bold text-lg">{title}</Text>
    </Pressable>
  )
}




