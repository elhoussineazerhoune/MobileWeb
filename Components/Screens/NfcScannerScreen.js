import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Platform, ImageBackground } from "react-native";
import NfcManager, { Ndef, NfcTech, nfcManager } from "react-native-nfc-manager";
import NfcPrompt from "../Common/NfcPrompt"
import { StatusBar } from "expo-status-bar";
import Feather from 'react-native-vector-icons/Feather'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const NfcScannerScreen = ({ navigation }) => {
    const [tagData, setTagData] = useState("");
    const [isNfcEnabled, setIsNfcEnabled] = useState(false);
    const [isNfcSupported, setIsNfcSupported] = useState(false);
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
            }

            NfcManager.start();

            return () => {
                NfcManager.stop();
            };
        };

        checkNFC();
    }, []);

    async function goToEnableNfc() {
        NfcManager.goToNfcSetting();
        let check = await NfcManager.isEnabled();
        setIsNfcEnabled(check);
    }
    const readData = (tag) => {
        const tagId = tag.id;
        const tagData = tag.ndefMessage[0].payload;
        const decryptedData = Ndef.text.decodePayload(tagData);
        const Realdata = JSON.parse(decryptedData);
        setTagData(`Tag ID: ${tagId}\nTag Data: ${decryptedData}`);
        console.log(Realdata.prix);
        navigation.navigate("Product", { produit: Realdata, tagId });
    };
    function handleNfcError(error) {
        console.warn(error);
        cancelScan()
    }

    async function cancelScan() {
        NfcManager.cancelTechnologyRequest();
        NfcManager.unregisterTagEvent();
    }

    async function readNfc() {
        try {
            if (!(await NfcManager.isEnabled())) {
                Alert.alert("Turn on NFC", "Please enable NFC", [
                    { text: "Go to Settings", onPress: goToEnableNfc },
                ]);
            } else {
                if (Platform.OS == "android") {
                    promptRef.current.setVisible(true);
                }
                const tech = NfcTech.Ndef;
                await NfcManager.requestTechnology(tech, {
                    alertMessage: "Hold your device near an NFC tag",
                });
                const tag = await NfcManager.getTag();
                if (tag) {
                    console.log(tag.id);
                    promptRef.current.setVisible(false);
                    readData(tag);
                }
            }
        } catch (error) {
            handleNfcError(error);
        } finally {
            try {
                cancelScan();
            } catch (error) {
                handleNfcError(error);
            }
        }
    }

    async function writeNfc() {
        try {
            if (Platform.OS == "android") {
                promptRef.current.setVisible(true);
            }
            if (!(await NfcManager.isEnabled())) {
                Alert.alert("Turn on NFC", "Please enable NFC", [
                    { text: "Go to Settings", onPress: goToEnableNfc },
                ]);
            } else {
                let data = {
                    idArticle: 0,
                    titre: "Tajine",
                    idArtisant: 1,
                    nomArtisant: "Youssef Moutaouakkil",
                    contactArtisant: "0653246897",
                    dateDebut: "2020-10-10",
                    dateFin: "2021-02-12",
                    prix: 200
                };
                let dataText = JSON.stringify(data);
                const tech = NfcTech.Ndef;
                await NfcManager.requestTechnology(tech, {
                    alertMessage: "Hold your device near an NFC tag",
                });
                let tag = await NfcManager.getTag();
                console.log(tag.id);
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
        } catch (error) {
            handleNfcError(error);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    }
    // if (!isNfcSupported) {
    //     return (
    //         <View className="flex h-screen justify-center self-center">
    //             <Text className="font-RubikB text-xl">
    //                 Votre telephone n'as pas d'NFC
    //             </Text>
    //         </View>
    //     );
    // }

    //     return (
    //         <View style={styles.container}>
    //             <Pressable style={styles.button} onPress={readNfc}>
    //                 <Text style={styles.buttonText}>Read NFC Tag</Text>
    //             </Pressable>
    //             <Pressable style={styles.button} onPress={writeNfc}>
    //                 <Text style={styles.buttonText}>Write NFC Tag</Text>
    //             </Pressable>
    //             <Pressable style={styles.button} onPress={cancelScan}>
    //                 <Text style={styles.buttonText}>Cancel</Text>
    //             </Pressable>
    //             <Text style={styles.tagData}>{tagData}</Text>
    //             <NfcPrompt ref={promptRef} onPress={cancelScan} />
    //         </View>
    //     );
    return (
        <View className="h-full">
            <StatusBar backgroundColor={'transparent'} style="light" />
            <ImageBackground source={require("../../assets/images/nfcBackground.png")} className='h-full w-full flex-1' />
            {isNfcSupported ? <>
                <Pressable className='bg-[#ff9500] rounded-full px-[50px] py-[10px] mb-[10px] absolute self-center top-[35%]' onPress={readNfc}>
                    <Text className='font-RubikM text-white text-[16px]'>Read NFC Tag</Text>
                </Pressable>
                <Pressable className="absolute bg-white rounded-full top-[42%] self-center p-1 opacity-80" onPress={() => { navigation.navigate("Home") }}>
                    <Feather name="x" size={30} color='#ff9500' />
                </Pressable>
            </> : <View className='absolute top-[35%] w-full'>
                <Text className=' text-white text-center font-RubikB text-xl'>
                    Votre telephone n'as pas d'NFC
                </Text>
            </View>}
            <View className='flex bg-white w-full pl-4 pt-5'>
                <View className="flex-row">
                    <Text className="font-RubikM mb-0 p-0 text-[34px] flex-1">Social Media</Text>
                    <Text className="mt-0 pl-4 font-RubikB text-[#9B9B9B] self-center mr-5">Plus</Text>
                </View>
                <Text className="mt-0 pl-4 font-RubikM absolute top-[57px] text-[#9B9B9B]">Abonnez Vous</Text>
                <View className="p-10 mb-20 flex flex-row justify-around">
                    <View className='rounded-full border-[1.5px] w-[50px] border-[#ff9500]'>
                        <EvilIcons name="sc-facebook" size={50} />
                    </View>
                    <View className='rounded-full border-[1.5px] w-[50px] border-[#ff9500]'>
                        <EvilIcons name="sc-twitter" size={50} />
                    </View>
                    <View className='rounded-full border-[1.5px] w-[50px] h-[50px] border-[#ff9500]'>
                        <EvilIcons name="sc-youtube" size={50} />
                    </View>
                    <View className='rounded-full border-[1.5px] w-[50px] border-[#ff9500] justify-center items-center'>
                        <FontAwesome name="instagram" size={40} />
                    </View>
                </View>
            </View>
            <NfcPrompt ref={promptRef} onPress={cancelScan} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#007AFF",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
    },
    tagData: {
        textAlign: "center",
        fontSize: 16,
    },
});
export default NfcScannerScreen;
