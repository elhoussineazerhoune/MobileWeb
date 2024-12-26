import { View, Text ,StyleSheet ,Image ,Pressable} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

export default function HandicarftItem({item}) {
  const navigation=useNavigation();
  return (
    <Pressable onPress={()=>{navigation.navigate('VisitedProfile',item)}}>
        <View style={styles.container}>
      
          <View style={styles.item}>
            <View style={styles.imageContainer}>
              <Image source={require("../../assets/images/profile.png")} style={styles.image} />
            </View>
            
            <View style={{flexDirection:'column'}}>
              <Text style={{fontSize:20}}>{item.firstname} {item.lastname}</Text>
              
              <View style={{flexDirection:'row'}}>
                <Ionicons name="location" size={20} style={{ color: "#ff9500",marginTop:4,marginRight:4 }} />
                <Text style={{fontSize:15,color:'darkgrey',marginTop:4}}>{item.adresse}</Text>
              </View>
              
            </View>
            
          </View>
        </View>
  </Pressable>
      
    
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical:5,
    width:'100%'
  },
  item:{
    borderColor:'grey',
    borderWidth:0.5,
    paddingVertical:10,
    flexDirection:'row',
    paddingLeft:10,
    marginHorizontal:20,
    borderRadius:20,
    backgroundColor:'white',
    elevation:5,
    width:"93%",
    marginTop:0
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position:'relative',
    
},
imageContainer: {
    marginLeft: 5,
    marginRight:20,
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: "hidden",
    position: 'relative',
    
},
});

