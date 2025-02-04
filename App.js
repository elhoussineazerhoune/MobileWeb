import React, { useState, useEffect } from "react";
import HeaderNav from "./Components/Navigation/HeaderNav";
import { CartProvider } from './context/CartContext';
import * as Font from 'expo-font';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
        'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
        'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // or a loading screen
  }

  return (
    <CartProvider>
      <HeaderNav />
    </CartProvider>
  );
}
