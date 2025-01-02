import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SCREEN_WIDTH = Dimensions.get('window').width;

const PostSection = ({ item }) => {
    return (
        <View style={styles.container}>
            {/* Top Text */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: "flex-start" }}>
                <Image source={item.userImg} style={styles.userImg} />
                <Text>{item.name}</Text>
            </View>

            {/* Video Section */}
            <View style={styles.videoContainer}>
                <Image
                    source={item.postImg} // Replace with your image or video thumbnail
                    style={styles.PostImg}
                    resizeMode="cover"
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: "center", gap: 10 }}>
                <Ionicons name='thumbs-up-outline' size={20} /><Text>{item.like}</Text>
                <Ionicons name='thumbs-down-outline' size={20} /><Text>{item.dislike}</Text>
            </View>



        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
    },
    topText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10,
    },
    videoContainer: {
        width: SCREEN_WIDTH - 20,
        height: (SCREEN_WIDTH - 20) * 0.5625, // Maintain 16:9 aspect ratio,
        marginBottom: 10,
        zIndex: 10,
    },
    PostImg: {
        width: "95%",
        height: '100%',
        borderRadius: 10,
        resizeMode: "contain",
        backgroundColor: '#ccc',
    },

    userImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    }
});

export default PostSection;
