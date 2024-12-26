import {
    Image,
    useWindowDimensions,
    Pressable,
    StyleSheet,View,Text
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";



export default function EventItem({ item }) {
    const window = useWindowDimensions();
    const width = window.width * 0.8;
    React.useEffect(()=>{
        console.log(item);
        
    },[])

    const navigation = useNavigation();
    return (
        <Pressable onPress={() => navigation.navigate("EventScreen", { item: item })}>
            <Image
                className="rounded-2xl "
                source={{ uri: `http://10.0.2.2:3001/images/expositions/${item.image}`}}
                style={{ width, height: 200, alignSelf: "center" }}
            />
            <View style={styles.container}>
                <Text style={styles.name}>{item.titre}</Text>
                <View style={{display:"flex",flexDirection:"row",gap:2,marginTop:10}}>
                    <Ionicons name="location" size={15} style={{ color: "#ff9500" }}/>
                    <Text style={styles.loc}>{item.location}</Text>
                    <Ionicons name="calendar" size={15} style={{ color: "#ff9500" ,marginLeft:10}}/>
                    <Text style={styles.date}>{new Date(item.dateDebut).getDate()+"/"+new Date(item.dateDebut).getMonth()+"/"+new Date(item.dateDebut).getFullYear()}</Text>
                </View>   
            </View>
        </Pressable>
    );
}

const styles=StyleSheet.create({
    container:{
        position:"absolute",
        padding:10,
        display:"flex",
        alignItems:"center",
        bottom:10,
        backgroundColor:"#3C3D37",
        left:"12.5%",
        right:"12.5%",
        borderRadius:15,
        opacity:0.85,
        width:"75%"
    },
    name:{
        fontSize:16,
        color:"#EEEEEE",
        fontWeight:"600",
        opacity:1.3,
        textAlign:"center"
    },
    date:{
        fontSize:12,
        color:"#EEEEEE",
        fontWeight:"500",
    },
    loc:{
        fontSize:12,
        color:"#EEEEEE",
        fontWeight:"500",
        marginRight:10
    }

})
