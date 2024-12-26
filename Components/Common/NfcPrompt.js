import {
    View,
    Text,
    Modal,
    StyleSheet,
    Dimensions,
    Pressable,
    Animated,
} from "react-native";
import React, { useEffect, useState } from "react";

function NfcPrompt(props, ref) {
    const [visible, setVisible] = useState(false);
    const [_visible, _setVisible] = useState(false);
    // const [hintText,setHintText] = useState("");
    const animValue = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (ref) {
            ref.current = {
                setVisible: _setVisible,
                // setHintText
            };
        }
    }, [ref]);

    useEffect(() => {
        if (_visible) {
            setVisible(true);
            Animated.timing(animValue, {
                duration: 300,
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                duration: 300,
                toValue: 0,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
                // setHintText("");
            });
        }
    }, [_visible, animValue]);
    const backdropAnimStyle = {
        opacity: animValue,
    };
    const promptAnimation = {
        transform: [
            {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [500, 0],
                }),
            },
        ],
    };
    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        StyleSheet.absoluteFill,
                        backdropAnimStyle,
                    ]}
                >
                    <Animated.View style={[styles.prompt, promptAnimation]}>
                        <Text style={styles.hint}>Scanning Tag ...</Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                props.onPress,
                                _setVisible(false);
                            }}
                        >
                            <Text>Cancel</Text>
                        </Pressable>
                    </Animated.View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    backdrop: {
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    prompt: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: Dimensions.get("screen").width - 40,
        backgroundColor: "white",
        borderRadius: 8,
        paddingVertical: 60,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 20,
    },
    hint: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "darkgray",
    },
});
export default React.forwardRef(NfcPrompt);
