import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import Logo from '../../assets/logo.png'

export default function LoadingScreen({ navigation }) {
  setTimeout(() => {
    navigation.replace('MainContainer');
  }, 3000);
  return (
    <View style={styles.view}>
      <StatusBar style={styles.statusbar} hidden={false} />
      <Image style={{ width: 200, height: 150 }} source={Logo} />
      <Text style={styles.text}>Stylish</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  statusbar: {

  },
  view: {
    width: '100%',
    height: "100%",
    backgroundColor: '#59D6FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginTop: 10,
    marginRight: 5,
    fontSize: 50,
    color: 'black',
    fontWeight:'bold',
    fontStyle:'italic'
  }
})