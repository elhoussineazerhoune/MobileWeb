import { View, Text } from "react-native";
import React from "react";
import SmallButton from "../Common/SmallButton";
import {
  FlatList,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import SmallItem from "../Common/SmallItem";
import Animated, { FadeInLeft } from "react-native-reanimated";
import c1 from "../../assets/images/categories/c1.jpeg";
import c2 from "../../assets/images/categories/c2.jpeg";
import c3 from "../../assets/images/categories/c3.jpeg";
import c4 from "../../assets/images/categories/c4.jpeg";
import c5 from "../../assets/images/categories/c5.jpeg";
import c6 from "../../assets/images/categories/c6.jpeg";


// ["Poterie,Zlij,tapis,Cuir,Peinturen,Couture,Charpentrie,Forge"]

const categories = [
  {
    id: 0,
    titre: "Casual",
    imageUri: c1,
    number: 20,
  },
  {
    id: 1,
    titre: "Formal",
    imageUri: c2,
    number: 36
  },
  {
    id: 2,
    titre: "Streetwear",
    imageUri: c3,
    number: 76
  },
  {
    id: 3,
    titre: "Minimalist",
    imageUri: c4,
    number: 6
  },
  {
    id: 4,
    titre: "Gothic",
    imageUri: c5,
    number: 106

  },
  {
    id: 5,
    titre: "Athleisure",
    imageUri: c6,
    number: 86
  }

];

export default function CategoriesSection() {
  return (
    <Animated.View entering={FadeInLeft.duration(600)}>
      <GestureHandlerRootView>
        <View className="flex flex-row mt-2 ">
          <Text className="font-[Rubik-SemiBold] text-xl my-3 ml-3 flex-1 ">
            STYLES
          </Text>
          <View className="mr-3 ">
            {/* <SmallButton onPress={() => console.log("pressed")}>
              Voir plus
            </SmallButton> */}
          </View>
        </View>
        <View>
          <FlatList
            data={categories}
            horizontal
            renderItem={({ item }) => <SmallItem item={item} />}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={{ paddingRight: 20 }} />
        </View>
      </GestureHandlerRootView>
    </Animated.View>
  );
}
