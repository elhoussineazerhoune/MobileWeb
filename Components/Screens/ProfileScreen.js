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
    TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import ProductPost from "../Common/ProductPost";
import { Avatar, Button, Icon } from 'react-native-elements';

const posts = [
    // { "id": 1, "imageUri": require("../../assets/products/p1.jpeg") },
    { "id": 2, "imageUri": require("../../assets/products/p2.jpeg") },
    { "id": 3, "imageUri": require("../../assets/products/p3.jpeg") },
    { "id": 4, "imageUri": require("../../assets/products/p4.jpeg") },
    { "id": 5, "imageUri": require("../../assets/products/p5.jpeg") },



]

function ProfileScreen({ navigation, route }) {
    const { width } = Dimensions.get('window');
    const ITEM_WIDTH = (width - 20) / 3;
    //   let data = route.params;
    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [image, setimage] = useState();
    const [Posts, setPosts] = useState();

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
    // useEffect(() => {
    //     handleProfile();
    // }, []);
    // useEffect(() => {
    //     handleProductImg();
    // }, [user])

    function handleSignOut() {
        AsyncStorage.removeItem("token")
        navigation.navigate("Login");
    }
    // function handleRefresh() {
    //     setIsConnected(false);
    //     handleProfile();
    // }

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

    // if (!isConnected) {
    //     return (
    //         <View className="h-screen items-center justify-center">
    //             <ActivityIndicator size='' color='#4D2222' />
    //         </View>
    //     )
    // }

    return (
        <GestureHandlerRootView>
            <View>
                <View style={styles.header}>
                    <Icon name="arrow-back" type="material" color="#fff" onPress={() => { navigation.goBack() }} />
                    <Text style={styles.username}>Azerhoune elhoussine</Text>
                    <Icon name="search" type="material" color="#fff" />
                </View>
                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <Image
                        source={require('../../assets/images/img1.jpeg')}
                        style={styles.bannerImage}
                    />
                    <Avatar
                        rounded
                        size="xlarge"
                        source={require('../../assets/images/img1.jpeg')}
                        containerStyle={styles.avatar}
                    />


                </View>
                {/* Intro Section */}

                <View style={styles.introContainer}>
                    <View style={styles.cardView}>
                        <Text style={styles.name}>Azerhoune elhoussine</Text>
                    </View>
                    <View style={styles.introInfo}>
                        <Ionicons name="call" size={15} color="#486FFB" />
                        <Text>+212 090987751</Text>
                    </View>
                    <View style={styles.introInfo}>
                        <Ionicons name="heart" size={15} color="#486FFB" />
                        <Text>20 piece</Text>
                    </View>
                    <View style={styles.introInfo}>
                        <Ionicons name="pencil" size={15} color="#486FFB" />
                        <Text>Hey I am using jjottia app</Text>
                    </View>
                </View>
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
        textAlign: 'center',
        marginTop: 12,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: 'transparent',
        zIndex: 10,
        paddingHorizontal: 10,
        fontWeight: '700'
    },
    username: {
        flex: 1,
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '700'
    },
    profileInfo: {
        alignItems: 'center',
        marginTop: -50,
        justifyContent: 'center',

    },
    bannerImage: {
        width: '100%',
        height: 150,
    },
    avatar: {
        position: 'absolute',
        top: 100,
        borderWidth: 5,
        borderColor: '#fff',
        marginRight: 0,
        zIndex: 10,
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    },
    subText: {
        color: 'gray',
        marginTop: 4,
        marginLeft: 5
    },
    cardView: {
        alignSelf: "center",
        paddingBottom: 1,
        alignItems: "center",
        paddingLeft: 10,
        paddingTop: 15,
        position: 'relative',
        marginTop: 20,
        marginBottom: 20,
    },
    publishButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        borderRadius: 25,
        paddingHorizontal: 5,
        alignItems: 'center',
        width: '35%',
        display: "flex",
        marginBottom: 20
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16,
        alignSelf: 'flex-end',
        gap: 10,
        paddingHorizontal: 20,
        // borderWidth:1,
        width: "100%",
        justifyContent: "flex-end"
    },
    linkButton: {
        alignSelf: "flex-start",
        backgroundColor: '#FF52C0',
        padding: 10,
        borderRadius: 20,
        marginTop: 16,
        marginLeft: 20,
        position: 'absolute',
        top: 250,
        zIndex: 10,
        width: "30%",

    },
    linkButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    introContainer: {
        paddingHorizontal: 10,
        marginTop: 60,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 8,
        marginHorizontal: 15,
        position: 'relative',
        paddingBottom: 10

    },
    introTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    introText: {
        fontSize: 14,
        marginTop: 4,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    headingPosts: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: 10,
        marginBottom: 20
    },
    introInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 10,
        marginBottom: 10
    },

});
