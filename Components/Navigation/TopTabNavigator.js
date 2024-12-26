import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ArtisansOfCategorie from '../Screens/ArtisansOfCategorie';
import ProductsOfCategorie from '../Screens/ProductsOfCategorie';

const Tab = createMaterialTopTabNavigator();

export default function TopTabNavigator({ route }) {
    const { categorie } = route.params;
    return (
        <Tab.Navigator screenOptions={{tabBarIndicatorStyle:{backgroundColor:'#ff9500'}}} style={{paddingVertical:35,backgroundColor:'white'}}>
            <Tab.Screen name="ProductsOfCategorie" options={{ tabBarLabel: "Produits" }}>{() => <ProductsOfCategorie categorie={categorie} />}</Tab.Screen>
            <Tab.Screen name="ArtisansOfCategorie" options={{ tabBarLabel: "Artisans" }}>{() => <ArtisansOfCategorie categorie={categorie} />}</Tab.Screen>
        </Tab.Navigator>
    )
} 