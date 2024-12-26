import * as React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, PermissionsAndroid, Image, Platform, Alert } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NfcPrompt from '../Common/NfcPrompt';
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

export default function AddProductScreen({ navigation, route }) {
    const { artisan } = route.params;
    const concatenatedate = (date) => {
        return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    }

    const initialProductInfo = {
        titre: "",
        dateDebut: concatenatedate(new Date()),
        dateFin: concatenatedate(new Date()),
        matierePremiere: "",
        description: "",
        prix: "",
    }

    const [productInfo, setProductInfo] = useState(initialProductInfo);
    const [showDateDebut, setShowDateDebut] = useState(false);
    const [showDateFin, setShowDateFin] = useState(false);
    const [dateDebut, setDateDebut] = useState(new Date());
    const [dateFin, setDateFin] = useState(new Date());
    const [selectedImage, setSelectedImage] = useState('');
    const [max, setMax] = useState();
    const [isNfcEnabled, setIsNfcEnabled] = useState(false);
    const [isNfcSupported, setIsNfcSupported] = useState(false);
    const [tagId, setTagId] = useState('');
    const [isCanceled, setIsCanceled] = useState(false);
    const [errors, setErrors] = useState({});

    const promptRef = useRef();

    useEffect(() => {
        const checkNFC = async () => {
            const authState = await NfcManager.isSupported();
            setIsNfcSupported(authState);
            if (!authState) {
                // console.warn("This device does not support NFC.");
                return;
            } else {
                setIsNfcEnabled(await NfcManager.isEnabled());
                if (!(await NfcManager.isEnabled())) {
                    Alert.alert("Turn on NFC", "Please enable NFC", [
                        { text: "Go to Settings", onPress: goToEnableNfc },
                    ]);
                }
            }
            NfcManager.start();
            return () => {
                NfcManager.stop();
            };
        };

        checkNFC();
        handleMax();
    }, []);

    async function goToEnableNfc() {
        NfcManager.goToNfcSetting();
        let check = await NfcManager.isEnabled();
        setIsNfcEnabled(check);
    }

    function handleNfcError(error) {
        console.warn(error);
        cancelScan();
    }

    async function cancelScan() {
        NfcManager.cancelTechnologyRequest();
        NfcManager.unregisterTagEvent();
    }

    async function writeNfc() {
        try {
            if (!(await NfcManager.isEnabled())) {
                Alert.alert("Turn on NFC", "Please enable NFC", [
                    { text: "Go to Settings", onPress: goToEnableNfc },
                ]);
                return false;
            } else {
                if (Platform.OS == "android") {
                    promptRef.current.setVisible(true);
                }
                let data = {
                    idArticle: max,
                    titre: productInfo.titre,
                    idArtisant: artisan.iduser,
                    nomArtisant: `${artisan.firstname} ${artisan.lastname}`,
                    contactArtisant: artisan.phone,
                    dateDebut: productInfo.dateDebut,
                    dateFin: productInfo.dateFin,
                    prix: productInfo.prix
                };
                let dataText = JSON.stringify(data);
                const tech = NfcTech.Ndef;
                await NfcManager.requestTechnology(tech, {
                    alertMessage: "Hold your device near an NFC tag",
                });
                let tag = await NfcManager.getTag();
                if (tag) {
                    console.log(tag);
                    setTagId(tag.id);
                    console.log(tagId);
                    let dataToWrite = Ndef.encodeMessage([
                        Ndef.textRecord(dataText),
                    ]);
                    console.log(dataToWrite);
                    if (dataToWrite) {
                        try {
                            await NfcManager.ndefHandler.writeNdefMessage(dataToWrite);
                            console.log("Data written successfully");
                            promptRef.current.setVisible(false);
                        } catch (e) {
                            console.log("ERROR", e);
                            promptRef.current.setVisible(false);
                        }
                    }
                }
            }
        } catch (error) {
            handleNfcError(error);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    }

    function handleOnChangeDateDebut({ type }, selectedDate) {
        if (type == "set") {
            setShowDateDebut(false);
            setDateDebut(selectedDate);
            handleOnchange("dateDebut", concatenatedate(selectedDate));
        } else {
            setShowDateDebut(false);
        }
    }

    function handleOnChangeDateFin({ type }, selectedDate) {
        if (type == "set") {
            setShowDateFin(false);
            setDateFin(selectedDate);
            handleOnchange("dateFin", concatenatedate(selectedDate));
        } else {
            setShowDateFin(false);
        }
    }

    function handleOnchange(key, value) {
        setProductInfo(prevState => ({ ...prevState, [key]: value }));
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return 1;
            } else {
                return 0;
            }
        } catch (err) {
            console.warn(err);
            return 0;
        }
    };

    async function openCamera() {
        console.log("camera launched");
        requestCameraPermission();
        await launchCamera({
            title: "Titre",
            cameraType: "back",
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        }, (response) => {
            if (!response.didCancel) {
                setSelectedImage(response);
                console.log(selectedImage);
            }
        });
    }

    function handleMax() {
        axios.post("http://10.0.2.2:3001/getMaxProducts").then((res) => {
            console.log("max ", res.data.max);
            setMax(res.data.max + 1);
        });
    }

    const validateFields = () => {
        const newErrors = {};
        if (!productInfo.titre) newErrors.titre = "Titre est obligatoire";
        if (!productInfo.matierePremiere) newErrors.matierePremiere = "Matière première est obligatoire";
        if (!productInfo.description) newErrors.description = "Description est obligatoire";
        if (!productInfo.prix) newErrors.prix = "Prix est obligatoire";
        if (!selectedImage) newErrors.image = "Image est obligatoire";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleAddProduct = async () => {
        if (validateFields()) {
            console.log(productInfo);
            await writeNfc();
        }
    }

    useEffect(() => {
        if (tagId) {
            const hello = async () => {
                console.log(tagId);
                const token = await AsyncStorage.getItem("token");
                const formData = new FormData();

                formData.append("ProductImage", {
                    name: "pro_" + new Date().getTime() + ".jpg",
                    uri: selectedImage.assets[0].uri,
                    type: selectedImage.assets[0].type
                });
                await axios.post("http://10.0.2.2:3001/uploadImage", formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(async (res) => {
                    let filename = res.data;
                    console.log(filename);
                    await axios.post("http://10.0.2.2:3001/addProduct", { id: max, productInfo, token, filename, tagId }).then(async (res) => {
                        console.log(res.data);
                        navigation.navigate("Home");
                    });
                }).catch((error) => {
                    console.log("error", error);
                });
            }
            hello();
        }
    }, [tagId]);

    if (!isNfcSupported) {
        return (
            <View className="flex h-screen justify-center self-center">
                <Text className="font-RubikB text-xl">
                    Votre telephone n'as pas d'NFC
                </Text>
            </View>
        );
    }
    return (
        <ScrollView vertical={true} style={styles.container}>
            <Pressable style={styles.back_pressable} onPress={() => navigation.goBack()}>
                <Text style={{ textAlign: "center", color: "#ff9500", fontWeight: "bold", fontSize: 17, }}>Acceuil</Text>
            </Pressable>
            <Text style={styles.title}>Ajouter un produit</Text>

            <View style={{ flexDirection: "column", paddingBottom: 80 }}>

                <Text style={styles.label}>donnez un titre pour votre article :</Text>
                <TextInput
                    placeholder="titre"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        handleOnchange("titre", text);
                    }}
                />
                {errors.titre && <Text style={styles.error}>{errors.titre}</Text>}

                <Text style={styles.label}>la date de la creation du produit :</Text>
                <Pressable onPress={() => setShowDateDebut(true)} >
                    <TextInput
                        style={styles.TextInput}
                        value={dateDebut.toDateString()}
                        onChangeText={() => {
                            setShowDateDebut(false);
                        }}
                        readOnly
                    />
                </Pressable>
                {showDateDebut && (<DateTimePicker value={dateDebut} display='spinner' mode='date' onChange={handleOnChangeDateDebut} maximumDate={new Date()} />)}

                <Text style={styles.label}>la date de la creation du produit :</Text>
                <Pressable onPress={() => setShowDateFin(true)} >
                    <TextInput
                        style={styles.TextInput}
                        value={dateFin.toDateString()}
                        editable={false}
                    />
                </Pressable>
                {showDateFin && (<DateTimePicker value={dateFin} display='spinner' mode='date' onChange={handleOnChangeDateFin} minimumDate={dateDebut} maximumDate={new Date()} />)}

                <Text style={styles.label}>la matiere premiere</Text>
                <TextInput
                    placeholder="entrez la matiere premiere"
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        handleOnchange("matierePremiere", text);
                    }}
                />
                {errors.matierePremiere && <Text style={styles.error}>{errors.matierePremiere}</Text>}

                <Text className="w-[80%] ml-[30px]">Entrer une description sur votre produit (materiaux utilisés, assistants...):</Text>
                <TextInput
                    placeholder="Description"
                    multiline
                    numberOfLines={5}
                    style={styles.TextInput}
                    onChangeText={(text) => {
                        handleOnchange("description", text);
                    }}
                />
                {errors.description && <Text style={styles.error}>{errors.description}</Text>}

                <Text style={styles.label}>donnez un prix pour votre article :</Text>
                <TextInput
                    placeholder="prix"
                    style={styles.TextInput} keyboardType='numeric'
                    onChangeText={(text) => {
                        handleOnchange("prix", parseInt(text));
                    }}
                />
                {errors.prix && <Text style={styles.error}>{errors.prix}</Text>}

                <Text style={styles.label}>Image:</Text>
                {selectedImage && <Image className="self-center my-5 aspect-auto w-[150px] h-[200px]" source={{ uri: selectedImage.assets[0].uri }} />}
                {errors.image && <Text style={styles.error}>{errors.image}</Text>}
                <Pressable className="self-center" onPress={openCamera}>
                    <Ionicons style={{ alignSelf: 'center' }} name='camera' size={40} color='#ff9500' />
                    <Text >Ouvrir camera</Text>
                </Pressable>

                <Pressable
                    style={styles.Pressable}
                    onPress={handleAddProduct}
                >
                    <Text style={styles.Text_pressable}>Fill the tag</Text>
                </Pressable>
                <NfcPrompt ref={promptRef} onPress={cancelScan} />

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f9fa",
        width: "auto",
        height: "auto",
        flex: 1,
        paddingBottom: 350
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
    },
    label: {
        fontFamily: "Rubic-Bold",
        textAlign: "left",
        fontSize: 14,
        color: "black",
        marginBottom: 1,
        marginLeft: 30,
        marginTop: 10
    },
    error: {
        color: 'red',
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
        borderBlockColor: 'grey'
    },
    icon: {
        marginRight: 5,
    },
    label_dropdown: {
        position: 'absolute',
        backgroundColor: '#ff9500',
        borderRadius: 20,
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
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
    cameraSection: {
        flexDirection: 'row',
        marginHorizontal: 50,
        paddingHorizontal: 55,
        justifyContent: 'space-between',
        fontSize: 30
    },
    cameraPressable: {
        backgroundColor: '#f8f9fa',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    jours: {
        borderWidth: 1,
        borderColor: "#7d8597",
        backgroundColor: "white",
        alignItems: "center",
        borderRadius: 10,
        marginHorizontal: 2,
        marginVertical: 10,
        paddingHorizontal: 20,
        paddingVertical: 6,
        width: '25%'
    }
});
