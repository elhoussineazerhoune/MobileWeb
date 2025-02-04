import React from 'react'
import { FlatList, View } from 'react-native'
import PostSection from './PostSection'

const data = [
    { "id": 1, "name": "Azarhoun elhoussine", "userImg": require('../../assets/images/img1.jpeg'), "postImg": require('../../assets/products/p2.jpeg'), "like": 1650, "dislike": 10 },
    { "id": 2, "name": "ruben dias", "userImg": require('../../assets/images/img1.jpeg'), "postImg": require('../../assets/products/p3.jpeg'), "like": 1987, "dislike": 10 },
    { "id": 3, "name": "phill foden", "userImg": require('../../assets/images/img1.jpeg'), "postImg": require('../../assets/products/p4.jpeg'), "like": 220, "dislike": 10 },
    { "id": 4, "name": "earling halland", "userImg": require('../../assets/images/img1.jpeg'), "postImg": require('../../assets/products/p5.jpeg'), "like": 100, "dislike": 10 },
    { "id": 5, "name": "bernardo silva", "userImg": require('../../assets/images/img1.jpeg'), "postImg": require('../../assets/products/p2.jpeg'), "like": 100, "dislike": 10 },
    { "id": 6, "name": "kevin debrauyne", "userImg": require('../../assets/images/img1.jpeg'), "postImg": require('../../assets/products/p4.jpeg'), "like": 100, "dislike": 10 },
]
const Posts = () => {
    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <PostSection item={item} />}
            />
        </View>
    )
}

export default Posts