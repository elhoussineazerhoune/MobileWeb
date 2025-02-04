import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'
import Logo from '../../assets/logo.png'

export default function LoadingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      navigation.replace('MainContainer');
    }, 3000);
  }, []);

  return (
    <LinearGradient
      colors={['#FF385C', '#FF7B93']}
      style={styles.view}
    >
      <StatusBar style="light" />
      <Animated.View style={[
        styles.contentContainer,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}>
        <Image style={styles.logo} source={Logo} resizeMode="contain" />
        <Text style={styles.title}>Stylish</Text>
        <Text style={styles.tagline}>Elevate Your Style</Text>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#FFE8EC',
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
})