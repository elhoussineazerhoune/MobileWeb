import { View, useWindowDimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import EventItem from "../Common/EventItem";
import Animated, { FadeInLeft } from "react-native-reanimated";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Events() {
    const window = useWindowDimensions();
    const width = window.width * 0.8;
    const [activeIndex, setActiveIndex] = useState(0);
    const [expo, setExpo] = useState([]); // Correcting the state name to setExpo
    const FlatListRef = useRef();

    function handleDots() {
        return expo.map((dot, index) => {
            if (activeIndex === index) {
                return (
                    <View key={index}>
                        <View className="bg-black w-[10px] h-[10px] rounded-full mx-3 "></View>
                    </View>
                );
            } else {
                return (
                    <View key={index}>
                        <View className="bg-[#b6b7c0] w-[10px] h-[10px] rounded-full mx-3 "></View>
                    </View>
                );
            }
        });
    }

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    useEffect(() => {
        if(expo.length != 0){
            let interval = setInterval(() => {
                if (activeIndex === expo.length - 1) {
                    scrollToIndex(0);
                } else {
                    scrollToIndex(activeIndex + 1);
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [activeIndex, expo.length]);

    useEffect(() => {
        handleExposition();
    }, []);
 
    const scrollToIndex = (index) => {
        FlatListRef.current.scrollToIndex({ animated: true, index: index });
    };

    const getItemLayout = (data, index) => ({
        length: width,
        offset: Math.round(width * index),
        index: index,
    });

    const handleExposition = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await axios.get("http://10.0.2.2:3001/expositions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data) {
                setExpo(res.data); // Correcting the state setter to setExpo
            }
        } catch (error) {
            console.log("Error fetching expositions: ", error);
        }
    };

    return (
        <Animated.View entering={FadeInLeft.duration(500)}>
            <GestureHandlerRootView style={{ width, alignSelf: "center" }}>
                {expo && expo.length > 0 ? (
                    <>
                        <FlatList
                            data={expo}
                            horizontal
                            pagingEnabled
                            keyExtractor={(item) => item.idExposition} // Ensure the key is a string
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => <EventItem item={item} />}
                            onScroll={handleScroll}
                            ref={FlatListRef}
                            getItemLayout={getItemLayout}
                        />
                        <View className="flex flex-row justify-center items-center mt-2">
                            {handleDots()}
                        </View>
                    </>
                ) : (
                    <></> // Fallback UI when expo is null or empty
                )}
            </GestureHandlerRootView>
        </Animated.View>
    );
    
}
