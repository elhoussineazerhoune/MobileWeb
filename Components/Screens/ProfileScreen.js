import { useEffect, useState } from "react";
import {
    Image,
    Platform,  // Add this import
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
import { Avatar, Button, Icon, Card } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const posts = [
    // { "id": 1, "imageUri": require("../../assets/products/p1.jpeg") },
    { "id": 2, "imageUri": require("../../assets/products/p2.jpeg") },
    { "id": 3, "imageUri": require("../../assets/products/p3.jpeg") },
    { "id": 4, "imageUri": require("../../assets/products/p4.jpeg") },
    { "id": 5, "imageUri": require("../../assets/products/p5.jpeg") },

]

const mockOrders = [
    {
        id: 1,
        status: 'completed',
        date: '2024-01-15',
        total: 150.99,
        products: [
            { id: 1, name: 'Product 1', quantity: 2, price: 75.50 }
        ]
    },
    {
        id: 2,
        status: 'pending',
        date: '2024-01-20',
        total: 89.99,
        products: [
            { id: 2, name: 'Product 2', quantity: 1, price: 89.99 }
        ]
    },
    {
        id: 3,
        status: 'cancelled',
        date: '2024-01-22',
        total: 199.99,
        products: [
            { id: 3, name: 'Product 3', quantity: 1, price: 199.99 }
        ]
    }
];

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [image, setimage] = useState();
    const [Posts, setPosts] = useState();
    const [orders, setOrders] = useState(mockOrders);

    const [isAdmin, SetisAdmin] = useState(true);

    async function handleProfile() {
        const id = await AsyncStorage.getItem("ClientToken");
        // console.log(id);
        axios
            .post("http://10.0.2.2:3306/api/client/findcurrentclient", { id })
            .then((res) => {
                if (res.data.error) {
                    console.warn(res.data.error);
                } else {
                    console.log(res.data.user);
                    setUser(res.data.user);
                }
            }).catch((e) => console.warn(e));
    }

    useEffect(() => {
        handleProfile();
    }, []);

    function handleSignOut() {
        AsyncStorage.removeItem("ClientToken")
        navigation.navigate("Login");
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

    // const handleProductImg = async () => {
    //     let idArtisant = user.iduser;
    //     console.log(user.iduser);
    //     await axios.post('http://10.0.2.2:3001/productsByArtisant', { idArtisant })
    //         .then((res) => {
    //             if (res.data.error) {
    //                 console.warn(res.data.error);
    //             } else {
    //                 console.log(res.data);
    //                 setPosts(res.data);
    //             }
    //         })
    // }

    if (!user) {
        <ActivityIndicator size="large" color="#0000ff" />
    } else {
        return (
            <View style={styles.container}>
                <StatusBar style="light" backgroundColor="#FF385C" />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.headerOverlay} />
                        <View style={styles.profileHeader}>
                            <Avatar
                                rounded
                                size={100}
                                source={require('../../assets/images/img1.jpeg')}
                                containerStyle={styles.avatar}
                            />
                            <Text style={styles.profileName}>{user.nom} {user.prenom}</Text>
                            {/* <Text style={styles.profileEmail}>{user.email}</Text> */}
                        </View>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>4</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                    </View>

                    {/* Profile Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfile')}>
                            <Ionicons name="pencil" size={20} color="#FF385C" />
                            <Text style={styles.actionText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Settings')}>
                            <Ionicons name="settings-outline" size={20} color="#FF385C" />
                            <Text style={styles.actionText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CreateArticle')}>
                            <Ionicons name="pencil-outline" size={20} color="#FF385C" />
                            <Text style={styles.actionText}>Créer Article</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recent Orders */}
                    <View style={styles.ordersContainer}>
                        <Text style={styles.sectionTitle}>Recent Orders</Text>
                        {orders.map((order) => (
                            <TouchableOpacity
                                key={order.id}
                                style={styles.orderCard}
                                onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                            >
                                <View style={styles.orderHeader}>
                                    <View>
                                        <Text style={styles.orderNumber}>Order #{order.id}</Text>
                                        <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={[
                                        styles.orderStatus,
                                        styles[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`]
                                    ]}>
                                        {order.status}
                                    </Text>
                                </View>
                                <View style={styles.orderFooter}>
                                    <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#666" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                        <Ionicons name="log-out-outline" size={20} color="#FF385C" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

}

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
        height: 220,
        backgroundColor: '#FF385C',
        position: 'relative',
        paddingTop: Platform?.OS === 'ios' ? 50 : 25, // Add optional chaining
    },
    headerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    profileHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    avatar: {
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 8,
    },
    profileEmail: {
        color: '#FFFFFF',
        opacity: 0.8,
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginHorizontal: 16,
        marginTop: -30,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF385C',
    },
    statLabel: {
        color: '#666',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        marginTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F3',
        padding: 12,
        borderRadius: 12,
        width: '45%',
        justifyContent: 'center',
    },
    actionText: {
        marginLeft: 8,
        color: '#FF385C',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        marginLeft: 16,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    orderDate: {
        color: '#666',
        fontSize: 14,
        marginTop: 4,
    },
    orderStatus: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statusCompleted: {
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
    },
    statusPending: {
        backgroundColor: '#FFF3E0',
        color: '#EF6C00',
    },
    statusCancelled: {
        backgroundColor: '#FFEBEE',
        color: '#C62828',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF385C',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginVertical: 24,
        marginBottom: 40, // Added extra bottom margin
        padding: 16,
        backgroundColor: '#FFF0F3',
        borderRadius: 12,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 90, // Increased padding to account for navbar
    },
});
