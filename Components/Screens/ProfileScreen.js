import { useEffect, useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import ProductPost from "../Common/ProductPost";


function ProfileScreen({ navigation, route }) {
    const { width } = Dimensions.get('window');
    const ITEM_WIDTH = (width - 20) / 3;
    //   let data = route.params;
    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [image, setimage] = useState();
    const [posts, setPosts] = useState();

    async function handleProfile() {
        const token = await AsyncStorage.getItem("token");
        axios
            .post("http://10.0.2.2:3001/profile", { token })
            .then((res) => {
                if (res.data.error) {
                    console.warn(res.data.error);
                } else {
                    setUser(res.data);
                    setIsConnected(true);
                }
            }).catch((e) => console.warn(e));
    }
    useEffect(() => {
        handleProfile();
    }, []);
    useEffect(() => {
        handleProductImg();
    }, [user])

    function handleSignOut() {
        AsyncStorage.removeItem("token")
        navigation.navigate("Login");
    }
    function handleRefresh() {
        setIsConnected(false);
        handleProfile();
    }

    const takephotofromlibrary = async () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
            },
            async response => {
                if (response.didCancel) {
                    console.log("user cancelled image picker");
                } else if (response.errorCode) {
                    console.log(response.errorCode);
                } else if (response.customButton) {
                    console.log("custombutton");
                } else {
                    const source = { uri: response.assets[0].uri }
                    setimage(source);
                    console.log(image);

                    const formData = new FormData();
                    formData.append("ProfileImage", {
                        name: "profile_" + new Date().getTime() + ".jpg",
                        uri: response.assets[0].uri,
                        type: response.assets[0].type
                    })
                    await axios.post("http://10.0.2.2:3001/uploadProfileImage", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                        .then(async (res) => {
                            const filename = res.data;
                            console.log(filename);
                            const token = await AsyncStorage.getItem("token");
                            await axios.post("http://10.0.2.2:3001/appendProfileImg", { token, filename })
                                .then(async (res) => {
                                    console.log(res.data);
                                    navigation.replace("Profile");
                                });
                        }).catch((error) => {
                            console.log("error : ", error);
                        });
                }
            })
    };

    const handleProductImg = async () => {
        let idArtisant = user.iduser;
        console.log(user.iduser);
        await axios.post('http://10.0.2.2:3001/productsByArtisant', { idArtisant })
            .then((res) => {
                if (res.data.error) {
                    console.warn(res.data.error);
                } else {
                    console.log(res.data);
                    setPosts(res.data);
                }
            })
    }
    if (user.isVerified == 0) {
        return (
            <ScrollView refreshControl={<RefreshControl onRefresh={handleRefresh} />}>
                <View className="flex h-screen justify-center self-center">
                    <Text className="font-RubikB text-xl">
                        Attendez un Administrateur pour vous verifier
                    </Text>
                </View>
            </ScrollView>
        )
    }

    if (!isConnected) {
        return (
            <View className="h-screen items-center justify-center">
                <ActivityIndicator size='' color='#4D2222' />
            </View>
        )
    }

    return (
        <GestureHandlerRootView>
            <View>
                <View style={styles.containerInfos}>
                    <View style={styles.img_name}>
                        <View style={styles.imageContainer}>
                            <Image source={
                                user.ProfileImg != null ? { uri: (`http://10.0.2.2:3001/images/${user.ProfileImg}`) } : { uri: (`http://10.0.2.2:3001/images/profile.png`) }
                            } style={styles.image} />
                        </View>
                        <Pressable style={styles.add_press} onPress={() => { takephotofromlibrary() }}>
                            <Ionicons name="add-outline" size={20} style={styles.changeProfile} />
                        </Pressable>
                        <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
                        <Text className='text-center'>Categorie: {user.categorie}</Text>
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

                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                    <View style={styles.options}>
                        <Pressable style={styles.optionItem} onPress={() => { navigation.navigate("addProduct", { artisan: user }) }}>
                            <Ionicons name="add-circle-outline" size={20} style={{ color: "#ff9525", marginRight: 5, alignSelf: 'center' }} />
                            <Text style={{ color: 'grey', fontSize: 17, fontWeight: 'bold', alignSelf: 'center' }}>Ajouter un produit</Text>
                        </Pressable>
                        <Pressable style={styles.optionItem} onPress={() => { navigation.navigate("EditeInfo") }}>
                            <Ionicons name="create-outline" size={20} style={{ color: "#ff9525", marginRight: 5, alignSelf: 'center' }} />
                            <Text style={{ color: 'grey', fontSize: 17, fontWeight: 'bold', alignSelf: 'center' }}>Modifier les info
                            </Text>
                        </Pressable>
                        <Pressable style={styles.optionItem} onPress={handleSignOut}>
                            <Ionicons name="log-out-outline" size={20} style={{ color: "#ff9525", marginRight: 5, alignSelf: 'center' }} />
                            <Text style={{ color: 'grey', fontSize: 17, fontWeight: 'bold', alignSelf: 'center' }}>Se deconnecter</Text>
                        </Pressable>
                    </View>
                </ScrollView>
                <Text
                    style={{ marginTop: 47, marginLeft: 15, color: "#5f5f5b", fontSize: 15, fontWeight: 'bold' }}
                >
                    Mes produits :
                </Text>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.idArtisant}
                        numColumns={3}
                        renderItem={({ item }) => <ProductPost item={item} />}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        </GestureHandlerRootView>
    );
}
export default ProfileScreen;

const styles = StyleSheet.create({
    containerInfos: {
        flexDirection: 'row',
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
        marginLeft: 10
    },
    info: {
        flexDirection: 'column',
        marginleft: 140,
        marginTop: 50
    },
    email: {
        marginTop: 10,
        flexDirection: "row",
        marginLeft: 10,
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
    },
    drawer: {
        flex: 1,
        alignItems: 'center'
    },
    options: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 30,
        marginRight: 20

    },
    optionItem: {
        backgroundColor: "transparent",
        paddingHorizontal: 13,
        paddingVertical: 15,
        borderRadius: 12,
        alignContent: "center",
        justifyContent: 'center',
        marginHorizontal: 5,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "#ff9500",
        width: 170,
        flexDirection: 'row'

    },

});
