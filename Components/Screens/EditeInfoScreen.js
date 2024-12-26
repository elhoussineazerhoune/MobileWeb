import * as React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function EditeInfoScreen({ navigation }) {
  const [name, setnameinput] = useState("");
  const [lastname, setlastnameinput] = useState("");
  const [adresse, setadresseinput] = useState("");
  const [contact, setcontactinput] = useState("");
  const [email, setemailinput] = useState("");
  const [description, setdescriptioninput] = useState("");

  //variables for categories
  const [isFocus, setIsFocus] = useState(false);
  const categories = [{ label: "fakhar", value: "fakhar" },
  { label: "forge", value: "forge" },
  { label: "peinture", value: "peinture" },
  { label: "tapis", value: "tapis" },
  { label: "zelij elbeldy", value: "zelij elbeldy" },
  { label: "couture", value: "couture" },
  { label: "Artisanat de cuir", value: "Artisanat de cuir" },
  { label: "Charpentrie", value: "Charpentrie" },
  { label: "Marbre", value: "Marbre" },
  { label: "Autre", value: "Autre" },
  ]
  const [categorie, setcategorie] = useState('');


  //variables for data validation
  const [invalidadresse, setInvalidadresse] = useState(false);
  const [invalidcontact, setInvalidcontact] = useState(false);
  const [invalidemail, setInvalidemail] = useState(false);
  const [invaliddesciption, setInvaliddesciption] = useState(false);


  const handleCategorieChange = (item) => {
    setcategorie(item.value);
  };

  const handleModify = async () => {
    const token = await AsyncStorage.getItem("token");
    axios.post("http://10.0.2.2:3001/EditInfos", {
      name, lastname, email, adresse, description, contact, token
    }).then((res) => {
      console.log(res.data);
    })
  };

  return (

    <ScrollView vertical={true} style={styles.container}>

      <Pressable style={styles.back_pressable} onPress={() => navigation.goBack()}>
        <Text style={{ textAlign: "center", color: "#ff9500", fontWeight: "bold", fontSize: 17, }}>back</Text>
      </Pressable>

      <Text style={styles.title}>Editer mes informations</Text>

      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Ionicons name="pencil-outline" size={20} style={{ color: "#ff9525", marginBottom: 10 }} />
          <Text style={styles.label}>Prenom</Text>
        </View>
        <TextInput
          placeholder={"Entrer votre prenom"}
          style={styles.TextInput}
          onChangeText={(text) => { setnameinput(text) }} />


        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Ionicons name="pencil-outline" size={20} style={{ color: "#ff9525", marginBottom: 10 }} />
          <Text style={styles.label}>Nom</Text>
        </View>

        <TextInput
          placeholder={"Entrer votre prenom"}
          style={styles.TextInput}
          onChangeText={(text) => { setlastnameinput(text) }} />




        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Ionicons name="pencil-outline" size={20} style={{ color: "#ff9525", marginBottom: 10 }} />
          <Text style={styles.label}>adresse</Text>
        </View>



        <TextInput
          placeholder="modifier votre adresse"
          style={styles.TextInput}
          onChangeText={(text) => {
            text.length <= 10
              ? setInvalidadresse(true)
              : setInvalidadresse(false);
            setadresseinput(text);
          }}
        />


        {invalidadresse && (
          <Text style={{ marginLeft: 20, color: "red" }}>
            (min 10 characters)
          </Text>
        )}

        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Ionicons name="pencil-outline" size={20} style={{ color: "#ff9525", marginBottom: 10 }} />
          <Text style={styles.label}>contact</Text>
        </View>



        <TextInput
          placeholder="modifier votre contact"
          style={styles.TextInput}
          keyboardType='numeric'
          onChangeText={(text) => {
            text.length < 10
              ? setInvalidcontact(true)
              : setInvalidcontact(false);
            setcontactinput(text);
          }}
        />

        {invalidcontact && <Text style={{ marginLeft: 20, color: 'red' }}>(min 10 characters)</Text>}



        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Ionicons name="pencil-outline" size={20} style={{ color: "#ff9525", marginBottom: 10 }} />
          <Text style={styles.label}>email</Text>
        </View>
        <TextInput
          placeholder="modifier votre email"
          style={styles.TextInput}
          onChangeText={(text) => {
            text.length <= 15
              ? setInvalidemail(true)
              : setInvalidemail(false);
            setemailinput(text);
          }}
        />
        {invalidemail && (
          <Text style={{ marginLeft: 20, color: "red" }}>
            (min 10 characters)
          </Text>
        )}


        <View style={{ flexDirection: 'row', marginLeft: 30 }}>
          <Ionicons name="pencil-outline" size={20} style={{ color: "#ff9525", marginBottom: 10 }} />
          <Text style={styles.label}>description</Text>
        </View>



        <TextInput
          placeholder={<Ionicons name="add-circle-outline" size={20} style={{ color: "#ff9525", marginRight: 5 }} /> && "description sur votre talent"}
          style={styles.TextInput}
          value={description}
          numberOfLines={5}
          onChangeText={(text) => {
            text.length <= 20
              ? setInvaliddesciption(true)
              : setInvaliddesciption(false);
            setdescriptioninput(text);
          }}
        />
        {invaliddesciption && (
          <Text style={{ marginLeft: 20, color: "red" }}>
            (min 20 characters)
          </Text>
        )}
        <Pressable
          style={styles.Pressable}
          onPress={() => {
            handleModify();
            navigation.navigate('MainContainer');
          }}
        >
          <Text style={styles.Text_pressable}>modifier votre informations</Text>
        </Pressable>


      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 80,
    backgroundColor: "white",
  },
  editinfos: {
    textAlign: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 3,
    marginBottom: 20

  },
  container: {
    backgroundColor: "#f8f9fa",
    width: "auto",
    height: "auto",
    flex: 1,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: "#7d8597",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 30,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    width: "85%"
  },
  Pressable: {
    backgroundColor: "#ff9500",
    paddingVertical: 15,
    borderRadius: 30,
    alignContent: "center",
    marginHorizontal: 30,
    marginVertical: 5,
    marginBottom: 100,
    marginTop: 20,
  },
  Text_pressable: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    marginTop: 60,
    marginBottom: 30,
  },
  label: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    marginLeft: 5,

  },
  Pressable_of_creating_account: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 40,
    marginHorizontal: 40
  },
  back_pressable: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 7,
    borderRadius: 50,
    alignContent: 'center',
    marginVertical: 5,
    marginTop: 30,
    marginRight: 310,
    marginLeft: 5,
    fontSize: 5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#ff9500',
    textAlign: 'center'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  ViewModify: {
    flexDirection: 'row',
    width: '100%',

  },
  modify: {
    backgroundColor: "#ff9500",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 8,
    paddingVertical: 2,
    width: "25%"
  },
  modifydesc: {
    backgroundColor: "#ff9500",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 8,
    width: "25%",
    height: "25%",
    marginTop: 75
  }
});
