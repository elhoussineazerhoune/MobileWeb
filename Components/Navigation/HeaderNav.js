import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoadingScreen from "../Screens/LoadingScreen";
import MainContainer from "./MainContainer";
import EventScreen from "../Screens/EventScreen";
import SignUp from "../Screens/SignUp";
import ProfileScreen from "../Screens/ProfileScreen";
import ProductPage from "../Common/ProductPage.js";
import NfcScannerScreen from "../Screens/NfcScannerScreen";
import AddProductScreen from "../Screens/AddProductScreen"
import ExpositionScreen from "../Screens/ExpositionScreen";
import VisitedProfile from "../Common/VisitedProfile.js";
import EditeInfoScreen from "../Screens/EditeInfoScreen";
import LoginScreen from "../Screens/LoginScreen";
import CartScreen from "../Screens/CartScreen.js";
import CategoryScreen from '../Screens/CategoryScreen';
import ProductDetailsScreen from '../Screens/ProductDetailsScreen';
import OrderDetails from '../Screens/OrderDetails';
import CreateArticle from '../Screens/CreateArticle';

const Stack = createNativeStackNavigator();
export default function HeaderNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="MainContainer" component={MainContainer} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Product" component={ProductPage} />
        <Stack.Screen name="EventScreen" component={EventScreen} />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen name="NfcScanner" component={NfcScannerScreen} />
        <Stack.Screen name="addProduct" component={AddProductScreen} />
        <Stack.Screen name="ExpositionScreen" component={ExpositionScreen} />
        <Stack.Screen name="VisitedProfile" component={VisitedProfile} />
        <Stack.Screen name="EditeInfo" component={EditeInfoScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="category" component={CategoryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CreateArticle" component={CreateArticle} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
