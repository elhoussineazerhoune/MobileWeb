import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function SettingsScreen() {
  return (
    <View className="h-screen w-full ">
      <Image source={require('../../assets/working.png')} style={{width: 300, height: 300,alignSelf:'center',marginTop:150}} />
      <Text style={styles.text} className="text-center">sera disponible dans la prochaine version</Text>

    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: 'black',
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 40,
    fontFamily: 'Rubik-bold'


  }

})