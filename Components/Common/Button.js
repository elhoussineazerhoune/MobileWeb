import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";

function Button(props) {
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Text style={styles.Text}>
        {props.children || "Press me"}
      </Text>
    </Pressable>
  );
}
export default Button;

const styles = StyleSheet.create({
  container: {
    width: 300,
    padding: 5,
    marginTop: 10,
    backgroundColor: "lightgreen",
    borderColor: "Black",
    borderWidth:1,
    borderRadius:5,
  },
  Text:{
    textAlign: "center",
    fontSize:17,
    fontWeight:"bold",
  }
})
