import * as React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp({ navigation }) {
    //variables for data
    const [name, setNameInput] = useState("");
    const [lastname, setLastnameInput] = useState("");
    const [email, setEmailInput] = useState("");
    const [password, setPasswordInput] = useState("");
    const [adresse, setAdresseInput] = useState("");
    const [contact, setContactInput] = useState("");
    const [newpassword, setNewPasswordInput] = useState("");

    const [invalidAdresse, setInvalidAdresse] = useState(false);
    const [invalidContact, setInvalidContact] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidNewPassword, setInvalidNewPassword] = useState(false);

    const handleSignUp = () => {
        axios.post("http://10.0.2.2:3306/api/client/register", {
            name, lastname, adresse, contact, email, password
        }).then((res) => {

            if (!res.data.error) {
                const token=AsyncStorage.setItem("ClientToken", res.data.token);
                navigation.navigate("Home");
            }
        });
    };

    return (
        <ScrollView vertical={true} style={styles.container}>
            <Pressable style={styles.back_pressable} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={23} />
            </Pressable>

            <Text style={styles.title}>Créer un compte</Text>

            <View style={{ flexDirection: "column" }}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                    placeholder="Entrez votre prénom"
                    style={styles.TextInput}
                    onChangeText={(text) => { setNameInput(text) }} />

                <Text style={styles.label}>Nom</Text>
                <TextInput
                    placeholder="Entrez votre nom"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        setLastnameInput(text);
                    }}
                />

                <Text style={styles.label}>Adresse</Text>
                <TextInput
                    placeholder="Entrez votre adresse"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        text.length <= 10
                            ? setInvalidAdresse(true)
                            : setInvalidAdresse(false);
                        setAdresseInput(text);
                    }}
                />
                {invalidAdresse && (
                    <Text style={styles.errorText}>
                        (min 10 caractères)
                    </Text>
                )}

                <Text style={styles.label}>Contact</Text>
                <TextInput
                    placeholder="Entrez votre contact"
                    style={styles.TextInput}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        text.length <= 8 ? setInvalidContact(true) : setInvalidContact(false);
                        setContactInput(text)
                    }} />
                {invalidContact && <Text style={styles.errorText}>(min 10 caractères)</Text>}


                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Entrez votre email"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        text.length <= 10
                            ? setInvalidEmail(true)
                            : setInvalidEmail(false);
                        setEmailInput(text);
                    }}
                />
                {invalidEmail && (
                    <Text style={styles.errorText}>
                        (min 10 caractères)
                    </Text>
                )}

                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                    placeholder="Entrez votre mot de passe"
                    style={styles.TextInput}
                    secureTextEntry
                    onChangeText={(text) => {
                        text.length < 10
                            ? setInvalidPassword(true)
                            : setInvalidPassword(false);
                        setPasswordInput(text);
                    }}
                />
                {invalidPassword && (
                    <Text style={styles.errorText}>
                        (min 10 caractères)
                    </Text>
                )}

                <Text style={styles.label}>Confirmez le mot de passe</Text>
                <TextInput
                    placeholder="Confirmez votre mot de passe"
                    style={styles.TextInput}
                    secureTextEntry
                    onChangeText={(text) => {
                        text != password
                            ? setInvalidNewPassword(true)
                            : setInvalidNewPassword(false);
                        setNewPasswordInput(text);
                    }}
                />
                {invalidNewPassword && (
                    <Text style={styles.errorText}>
                        (les mots de passe doivent être identiques)
                    </Text>
                )}

                <Pressable
                    style={styles.Pressable}
                    onPress={() => {
                        if (
                            adresse.length >= 10 &&
                            contact.length >= 10 &&
                            password.length >= 10 &&
                            newpassword === password &&
                            name &&
                            lastname
                        ) {
                            handleSignUp();
                        }
                    }}
                >
                    <Text style={styles.Text_pressable}>Créer un compte</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        paddingHorizontal: 20,
    },
    TextInput: {
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    Pressable: {
        backgroundColor: "deepskyblue",
        paddingVertical: 18,
        borderRadius: 12,
        marginVertical: 30,
        shadowColor: "#ff9500",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    Text_pressable: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
        fontSize: 18,
        letterSpacing: 0.5,
    },
    title: {
        textAlign: "center",
        fontSize: 32,
        marginBottom: 30,
        fontFamily: "Rubik-Bold",
        color: "#1a1a1a",
    },
    label: {
        fontSize: 15,
        color: "#4a4a4a",
        marginBottom: 8,
        marginLeft: 5,
        fontWeight: "600",
    },
    back_pressable: {
        paddingTop: 1,
        paddingHorizontal: 1,
        marginTop: 30,
        alignSelf: 'flex-start',
    },
    errorText: {
        color: "#dc3545",
        fontSize: 13,
        marginLeft: 5,
        marginTop: -10,
        marginBottom: 10,
    }
});
