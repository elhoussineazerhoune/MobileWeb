import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import axios, { all } from "axios";
import { Image } from 'react-native';

export default function ExpositionScreen() {
  return (
    <ScrollView vertical={true} style={styles.container}>
      <View style={{ marginBottom: 80 }}>
        <View style={styles.imageContainer}>
          {/* {uri: `http://10.0.2.2:3001/images/${item.image}`} */}
          <Image source={require('../../assets/fonts/expo1_edited.png')} style={styles.image} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'center' }} >
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#C40C0C' }}>le titre de l'exposition </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'center' }} >
          <Ionicons name='location' size={20} style={{ color: '#ff9500', marginRight: 10 }} />
          <Text style={{ fontSize: 20, fontFamily: 'bold' }}>la place de l'exposition </Text>
        </View>

        <Text style={{ fontSize: 15, fontFamily: 'bold', justifyContent: 'center', textAlign: 'center' }}>le prix de l'exposition </Text>

        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'center' }} >
          <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'center' }} >
            <Ionicons name='hourglass' size={20} style={{ color: '#ff9500', marginRight: 10 }} />
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#31363F' }}>le debut d 'exposition : </Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'center' }} >
            <Ionicons name='hourglass' size={20} style={{ color: '#ff9500', marginRight: 10 }} />
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#31363F' }}>la fin d'exposition : </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginRight: 10, justifyContent: 'space-around' }} >
          <Text style={{ fontSize: 15, fontFamily: 'bold' }}>date</Text>
          <Text style={{ fontSize: 15, fontFamily: 'bold' }}>date</Text>
        </View>
        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <Text style={{ color: '#32012F', fontWeight: 'bold' }}>description about exposition : </Text>
          <Text style={{ marginLeft: 20, color: '#31363F' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Text>
        </View>
        {/* <View style={styles.buttons}>
                <Pressable style={styles.Pressable} onPress={() => {}}>
                  <Text style={styles.Text_pressable}>reserver votre place</Text>
                </Pressable>
                <Pressable style={styles.PressableOfexit} onPress={() => {}}>
                    <Text style={styles.Text_pressableOfexit}>cancel</Text>
                </Pressable>
            </View> */}

      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',



  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: 'relative',
  },
  imageContainer: {
    width: all,
    height: 300,
    overflow: "hidden",
    position: 'relative',
    shadowRadius: 20,
    shadowColor: 'grey'
  },
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
});


