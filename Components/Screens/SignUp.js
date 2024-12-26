import * as React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import axios from "axios";
import { Dropdown } from 'react-native-element-dropdown';

export default function SignUp({ navigation }) {
    //variables for data
    const [name, setNameInput] = useState("");
    const [lastname, setLastnameInput] = useState("");
    const [username, setUsernameInput] = useState("");
    const [adresse, setAdresseInput] = useState("");
    const [contact, setContactInput] = useState("");
    const [email, setEmailInput] = useState("");
    const [password, setPasswordInput] = useState("");
    const [newpassword, setNewPasswordInput] = useState("");
    const [description, setDescriptionInput] = useState("");
    const [code, setCodeInput] = useState("");

    //variables for categories
    const [isFocus, setIsFocus] = useState(false);
    const categories = [
        { label: "Poterie", value: "poterie" },
        { label: "Forge", value: "forge" },
        { label: "Peinture", value: "peinture" },
        { label: "Tapis", value: "tapis" },
        { label: "Zellij elbeldy", value: "zelij elbeldy" },
        { label: "Couture", value: "couture" },
        { label: "Artisanat de cuir", value: "Artisanat de cuir" },
        { label: "Charpenterie", value: "Charpenterie" },
        { label: "Marbre", value: "Marbre" },
        { label: "Autre", value: "Autre" },
    ]
    const [categorie, setCategorie] = useState('');

    //variables for data validation
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [invalidAdresse, setInvalidAdresse] = useState(false);
    const [invalidContact, setInvalidContact] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidDescription, setInvalidDescription] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidNewPassword, setInvalidNewPassword] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);

    const handleCategorieChange = (item) => {
        setCategorie(item.value);
    };

    const handleSignUp = () => {
        axios.post("http://10.0.2.2:3001/Signup", {
            name, lastname, username, adresse, contact, email, password, description, categorie, code
        }).then((res) => {
            console.log(res.data);
            if (!res.data.error) {
                navigation.navigate("Home");
            }
        });
    };

    return (
        <ScrollView vertical={true} style={styles.container}>
            <Pressable style={styles.back_pressable} onPress={() => navigation.goBack()}>
                <Text style={{ textAlign: "center", color: "#ff9500", fontWeight: "bold", fontSize: 17 }}>Retour</Text>
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

                <Text style={styles.label}>Nom d'utilisateur</Text>
                <TextInput
                    placeholder="Créez un nom d'utilisateur"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        text.length <= 10
                            ? setInvalidUsername(true)
                            : setInvalidUsername(false);
                        setUsernameInput(text);
                    }}
                />
                {invalidUsername && (
                    <Text style={{ marginLeft: 20, color: "red" }}>
                        (min 10 caractères)
                    </Text>
                )}

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
                    <Text style={{ marginLeft: 20, color: "red" }}>
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
                {invalidContact && <Text style={{ marginLeft: 20, color: 'red' }}>(min 10 caractères)</Text>}

                <Text style={styles.label}>Catégorie</Text>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={categories}
                    search
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Sélectionnez votre catégorie' : '...'}
                    searchPlaceholder="Rechercher..."
                    value={categorie}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        handleCategorieChange(item);
                        setIsFocus(false);
                    }}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder="Entrez votre email"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        text.length <= 20
                            ? setInvalidEmail(true)
                            : setInvalidEmail(false);
                        setEmailInput(text);
                    }}
                />
                {invalidEmail && (
                    <Text style={{ marginLeft: 20, color: "red" }}>
                        (min 10 caractères)
                    </Text>
                )}

                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                    placeholder="Entrez votre mot de passe"
                    style={styles.TextInput}
                    secureTextEntry
                    onChangeText={(text) => {
                        text.length <= 10
                            ? setInvalidPassword(true)
                            : setInvalidPassword(false);
                        setPasswordInput(text);
                    }}
                />
                {invalidPassword && (
                    <Text style={{ marginLeft: 20, color: "red" }}>
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
                    <Text style={{ marginLeft: 20, color: "red" }}>
                        (les mots de passe doivent être identiques)
                    </Text>
                )}

                <Text style={styles.label}>Description de votre talent</Text>
                <TextInput
                    placeholder="Décrivez votre talent"
                    style={styles.TextInput}
                    value={description}
                    numberOfLines={5}
                    onChangeText={(text) => {
                        text.length <= 20
                            ? setInvalidDescription(true)
                            : setInvalidDescription(false);
                        setDescriptionInput(text);
                    }}
                />
                {invalidDescription && (
                    <Text style={{ marginLeft: 20, color: "red" }}>
                        (min 20 caractères)
                    </Text>
                )}

                <Text style={styles.label}>Code de la carte d'artisan</Text>
                <TextInput
                    placeholder="Entrez le code de votre carte d'artisan"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        text.length <= 10
                            ? setInvalidCode(true)
                            : setInvalidCode(false);
                        setCodeInput(text);
                    }}
                />
                {invalidCode && (
                    <Text style={{ marginLeft: 20, color: "red" }}>
                        (min 10 caractères)
                    </Text>
                )}

                <Pressable
                    style={styles.Pressable}
                    onPress={() => {
                        console.log(name, email, password, contact, adresse, description, categorie, code);
                        if (
                            username.length > 10 &&
                            adresse.length > 10 &&
                            contact.length > 9 &&
                            password.length > 10 &&
                            newpassword === password &&
                            description.length > 20 &&
                            name &&
                            lastname &&
                            categorie &&
                            code.length > 9
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
        marginVertical: 5,
        marginBottom: 30,
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
        fontFamily: "Rubik-Bold",
    },
    label: {
        textAlign: "left",
        fontSize: 14,
        color: "black",
        marginBottom: 5,
        marginLeft: 30,
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
    dropdown: {
        height: 50,
        borderColor: '#7d8597',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginBottom: 12,
        marginHorizontal: 30,
        marginTop: 10,
        backgroundColor: "#fff",
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
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
