import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Function to handle login request
    function handleLogin() {
        axios
            .post("http://10.0.2.2:3001/login", { username, password })
            .then((res) => {
                if (res.data.error) {
                    // email or password incorrect
                    setError(res.data.error);
                    setMessage(res.data.error);
                } else {
                    // correct credentials
                    console.log(res.data);
                    AsyncStorage.setItem("token", res.data.token);
                    navigation.navigate("Home");
                }
            })
            .catch((err) => console.warn(err));
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Espace Artisan</Text>

            <Text style={styles.label}>Nom d'utilisateur : </Text>

            <TextInput
                placeholder="Entrez votre nom d'utilisateur"
                style={styles.TextInput}
                onChangeText={(username) => setUsername(username)}
            ></TextInput>
            <Text style={styles.label}>Mot de passe : </Text>
            <TextInput
                placeholder="Entrez votre mot de passe"
                secureTextEntry={true}
                style={styles.TextInput}
                onChangeText={(password) => setPassword(password)}
            ></TextInput>
            <Text className="self-center">{message}</Text>
            <Pressable style={styles.Pressable} onPress={handleLogin}>
                <Text style={styles.Text_pressable} >
                    se connecter
                </Text>
            </Pressable>
            <Pressable>
                <Text style={styles.forgot_passwd}>Mot de passe oublié ?</Text>
            </Pressable>

            <Pressable
                style={styles.Pressable_of_creating_account}
                onPress={() => navigation.navigate("Sign Up")}
            >
                <Text>Créer un compte artisan</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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
        display: "flex",
        alignItems: "center",
        borderRadius: 10,
        marginHorizontal: 30,
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    title: {
        textAlign: "center",
        fontSize: 40,
        marginTop: 100,
        marginBottom: 30,
        fontFamily: "Rubik-Bold",
    },
    label: {
        textAlign: "left",
        fontSize: 14,
        color: "black",
        marginBottom: 5,
        marginLeft: 10,
    },
    forgot_passwd: {
        textAlign: "right",
        color: "red",
        marginRight: 20,
        marginBottom: 30,
    },
    Pressable_of_creating_account: {
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderColor: "#000",
        borderWidth: 2,
        borderRadius: 40,
        marginHorizontal: 40,
    },
});
