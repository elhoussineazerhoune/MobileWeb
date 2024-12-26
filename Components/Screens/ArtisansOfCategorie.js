import { View, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import axios from 'axios';
import HandicarftItem from "../Common/HandicraftItem";
import { StatusBar } from 'react-native';




export default function ArtisansOfCategorie({ categorie }) {
  const [Artisans, setArtisans] = useState([]);

  const handleArtisans = () => {
    axios.post("http://10.0.2.2:3001/GetArtisansByCategorie", { categorie })
      .then((res) => {
        if (res.data.error) {
          console.log(res.error);
        } else {
          setArtisans(res.data);
        }
      })
  }
  useEffect(() => {
    handleArtisans();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} />
      <View style={styles.navButtons}>
        <GestureHandlerRootView>
          <FlatList
            data={Artisans}
            vertical
            renderItem={({ item }) => <HandicarftItem item={item} />}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ paddingRight: 20 }} />
        </GestureHandlerRootView>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  },
  nav: {
    width: '40%',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    paddingBottom: 10,
    paddingHorizontal: 10
  },
})