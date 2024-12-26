import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, FlatList } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useState } from "react";
import axios, { all } from "axios";
import { Image } from 'react-native';
import ProductPost from './ProductPost';
import { ActivityIndicator } from 'react-native-paper';

export default function VisitedProfile({ route }) {
  // console.log(route.params);
  const user = route.params
  // const [user, setUser] = useState({});
  const [products, setProducts] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const handlePostsByArtisan = () => {
    const idArtisant = user.iduser;
    console.log(idArtisant);
    axios.post('http://10.0.2.2:3001/productsByArtisant', { idArtisant })
      .then((res) => {
        if (res.data.error) {
          console.warn(res.data.error);
        } else {
          console.log(res.data);
          setProducts(res.data);
        }
      })
  }
  useEffect(() => {
    handlePostsByArtisan();
  }, [])
  useEffect(() => {
    setIsConnected(true);
    console.log(' test', products);
  }, [products])

  if (!isConnected) {
    return (
      <View className="h-screen items-center justify-center">
        <ActivityIndicator size='' color='#4D2222' />
      </View>
    )
  }

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.img_name}>
          <View style={styles.imageContainer}>
            <Image source={require("../../assets/images/profile.png")} style={styles.image} />
          </View>
          <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
          <Text style={styles.categorie}>{user.categorie}</Text>
        </View>

        <View style={styles.info}>

          <View style={styles.adresse}>
            <Ionicons name="mail" size={20} style={{ color: "#ff9500" }} />
            <Text style={{ color: "#000", marginLeft: 10 }}>
              {user.email}
            </Text>
          </View>
          <View style={styles.email}>
            <Ionicons name="location" size={20} style={{ color: "#ff9500" }} />
            <Text style={{ color: "#000", marginLeft: 10 }} >
              {user.adresse}
            </Text>
          </View>
          <View style={styles.email}>
            <Ionicons name="call" size={20} style={{ color: "#ff9500" }} />
            <Text style={{ color: "#000", marginLeft: 10 }}>
              {user.phone}
            </Text>
          </View>

        </View>

      </View>

      <View style={{ flexDirection: "row", marginTop: 30, justifyContent: 'center' }}>
        <Ionicons
          name="pencil-outline"
          size={20}
          className="text-[#494C61]"
          style={{ color: "#ff9525", marginRight: 5 }}
        />
        <Text style={{ textAlign: "center", width: 300 }}>{user.description}</Text>
      </View>


      <Text style={{ marginTop: 47, marginLeft: 15, color: "#5f5f5b" }}>My Posts of products :</Text>
      <View style={{ marginTop: 10 }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.idArticle}
          numColumns={3}
          renderItem={({ item }) => <ProductPost item={item} />}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        />


      </View>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center'
  },
  image: {
    marginBottom: 30,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: 'relative'
  },
  imageContainer: {
    marginTop: 80,
    marginBottom: 10,
    marginLeft: 25,
    width: 80,
    height: 80,
    borderRadius: 50,
    overflow: "hidden",
    position: 'relative'
  },
  name: {
    color: "#000",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    justifyContent: 'flex-start',
    textAlign: 'center'
  },
  pressable: {
    marginTop: 40,
    marginLeft: 290,
  },
  deconnecter: {
    color: "red",
    fontSize: 16,
  },
  produit: {
    marginTop: 40,
    marginLeft: 10,
    color: "#444441",
  },
  data: {
    flexDirection: "row",
    backgroundColor: "#ff9500",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 1,
    borderRadius: 15,
  },
  stats: {
    marginTop: 30,
    paddingHorizontal: 50,
    alignItems: "center",
    width: "90%",
  },
  Pressable: {
    backgroundColor: "#ff9500",
    paddingVertical: 15,
    borderRadius: 30,
    alignContent: "center",
    marginHorizontal: 30,
    marginVertical: 20,
    marginBottom: 0,
  },
  Text_pressable: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  img_name: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center',
    width: 140,
  },
  categorie: {
    color: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  adresse: {
    marginTop: 50,
    flexDirection: "row",
    marginLeft: 3
  },
  info: {
    flexDirection: 'column',
    marginleft: 10,
    marginTop: 50,
    width: '100%'
  },
  email: {
    marginTop: 10,
    flexDirection: "row",
    marginLeft: 3,
    width: 200
  },
  changeProfile: {
    color: "#fff",
    fontWeight: 'bold'
  },
  add_press: {
    position: 'absolute',
    backgroundColor: '#ff9500',
    borderRadius: 50,
    zIndex: 99,
    left: 80,
    top: 135,
    padding: 2
  },
  menu_press: {
    top: 15,
    left: 0,
    padding: 10,
    left: 180,
  }
});