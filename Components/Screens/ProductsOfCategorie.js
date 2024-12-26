import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import ProductPost from '../Common/ProductPost';

export default function ProductsOfCategorie({ categorie }) {
  const [data, setdata] = useState();

  const handleProductsByCategorie = () => {
    axios.post('http://10.0.2.2:3001/GetProductsByCategorie', { categorie })
      .then((res) => {
        if (res.data.error) {
          console.log(res.error);
        } else {
          setdata(res.data);
        }
      })
  }
  useEffect(() => {
    handleProductsByCategorie();
  })

  return (
    <View style={{ marginTop: 10 }}>
      <GestureHandlerRootView>
        <FlatList
          data={data}
          vertical
          renderItem={({ item }) => <ProductPost item={item} />}
          scrollEnabled={true}
          numColumns={3}
          showsVerticalScrollIndicator={false} />
      </GestureHandlerRootView>
    </View>
  )
}