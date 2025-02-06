import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Function to handle login request
    function handleLogin() {
        axios
            .post("http://10.0.2.2:3306/api/client/login", { email, password })
            .then((res) => {
                console.log("===" + JSON.stringify(res.data));
                if (!res.data.success) {
                    // email or password incorrect
                    setError(res.data.message);
                    setMessage(res.data.message);
                } else {
                    if (res.data.admin) {
                        AsyncStorage.setItem("AdminToken", res.data.token);
                    } else {
                        AsyncStorage.setItem("ClientToken", res.data.token);
                    }
                    navigation.navigate("Home");
                }
            })
            .catch((err) => console.warn(err));
    }
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>S'inscrire</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nom d'utilisateur</Text>
                    <TextInput
                        placeholder="Entrez votre nom d'utilisateur"
                        style={styles.TextInput}
                        onChangeText={(username) => setEmail(username)}
                        placeholderTextColor="#9FA5C0"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry={true}
                        style={styles.TextInput}
                        onChangeText={(password) => setPassword(password)}
                        placeholderTextColor="#9FA5C0"
                    />
                </View>

                {message && <Text style={styles.errorMessage}>{message}</Text>}

                <Pressable style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                </Pressable>

                <Pressable onPress={() => { }}>
                    <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
                </Pressable>

                <Pressable
                    style={styles.createAccountButton}
                    onPress={() => navigation.navigate("Sign Up")}
                >
                    <Text style={styles.createAccountText}>Créer un compte</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: '500',
    },
    TextInput: {
        backgroundColor: '#F7F8F9',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    loginButton: {
        backgroundColor: 'deepskyblue',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#FF9500',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    loginButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    forgotPassword: {
        color: '#FF4444',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 15,
        fontWeight: '500',
    },
    createAccountButton: {
        borderWidth: 2,
        borderColor: '#1A1A1A',
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 30,
    },
    createAccountText: {
        color: '#1A1A1A',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    errorMessage: {
        color: '#FF4444',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
    },
});
