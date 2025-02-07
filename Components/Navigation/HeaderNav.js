import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoadingScreen from "../Screens/LoadingScreen";
import MainContainer from "./MainContainer";
import EventScreen from "../Screens/EventScreen";
import SignUp from "../Screens/SignUp";
import ProfileScreen from "../Screens/ProfileScreen";
import ProductPage from "../Common/ProductPage.js";
import NfcScannerScreen from "../Screens/NfcScannerScreen";
import ExpositionScreen from "../Screens/ExpositionScreen";
import VisitedProfile from "../Common/VisitedProfile.js";
import EditeInfoScreen from "../Screens/EditeInfoScreen";
import LoginScreen from "../Screens/LoginScreen";
import CartScreen from "../Screens/CartScreen.js";
import CategoryScreen from '../Screens/CategoryScreen';
import ProductDetailsScreen from '../Screens/ProductDetailsScreen';
import OrderDetails from '../Screens/OrderDetails';
import CheckoutScreen from '../Screens/CheckoutScreen';
import OrderConfirmationScreen from "../Screens/OrderConfirmationScreen";
import AdminDashboard from "../Screens/AdminDashboard";
import UserManager from "../Screens/Admin/UserManager.js";
import OrderManager from "../Screens/Admin/OrderManager.js";
import ProductManager from "../Screens/Admin/ProductManager.js";
import AddProduct from "../Screens/Admin/AddProduct.js";
import EditProduct from "../Screens/Admin/EditProduct.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AboutScreen from "../Screens/Settings/AboutScreen.js";
import HelpScreen from "../Screens/Settings/HelpScreen.js";

const Stack = createNativeStackNavigator();

export default function HeaderNav() {
  const [initialRoute, setInitialRoute] = useState('Loading');

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      const adminToken = await AsyncStorage.getItem('AdminToken');
      const clientToken = await AsyncStorage.getItem('ClientToken');

      if (adminToken) {
        setInitialRoute('AdminDashboard');
      } else if (clientToken) {
        setInitialRoute('MainContainer');
      } else {
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('Error checking auth tokens:', error);
      setInitialRoute('Login');
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="MainContainer" component={MainContainer} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Product" component={ProductPage} />
        <Stack.Screen name="EventScreen" component={EventScreen} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="NfcScanner" component={NfcScannerScreen} />
        <Stack.Screen name="checkout" component={CheckoutScreen} />
        <Stack.Screen name="ExpositionScreen" component={ExpositionScreen} />
        <Stack.Screen name="VisitedProfile" component={VisitedProfile} />
        <Stack.Screen name="EditeInfo" component={EditeInfoScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="UserManager" component={UserManager} />
        <Stack.Screen name="OrderManager" component={OrderManager} />
        <Stack.Screen name="ProductManager" component={ProductManager} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen
          name="category"
          component={CategoryScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen 
            name="Help" 
            component={HelpScreen}
            options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
