import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, } from 'react-native-elements'

interface ItemProps {
    shopName: string
    shopAddress: string
    category: string
    favorite: string
    price: string
}

const Item = (props: ItemProps) => {
    return (
        <View>
            <Card containerStyle={{borderRadius: 25}}>
                    <View style={{flexDirection: 'row'}}>
                        <View>
                            <Text style={{ color: 'grey', marginLeft: 5}}>店名</Text>
                            <Text style={styles.shopName}>{props.shopName}</Text>
                            <Text style={{ color: 'grey', marginLeft: 5, marginTop: 5}}>住所</Text>
                            <Text style={styles.shopAddress}>{props.shopAddress}</Text>
                            <View style={{flexDirection: 'row', marginTop: 10,}}>
                                <View style={styles.favorite}>
                                    <Text style={styles.itemName}>おすすめのメニュー</Text>
                                    <Text style={styles.menuName}>{props.favorite}</Text>
                                </View>
                                <View style={styles.price}>
                                    <Text style={styles.itemName}>値段</Text>
                                    <Text style={styles.menuName}>{props.price}</Text>
                                </View>
                                <View style={styles.category}>
                                    <Text style={styles.itemName}>カテゴリー</Text>
                                    <Text style={styles.categoryName}>{props.category}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
            </Card>
        </View>
    );
}
export default Item

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    card: {
        borderRadius: 10
    },
    shopName: {
        fontSize: 18,
        marginLeft: 5,
        marginTop: 10,
        fontWeight: '700'
    },
    shopAddress: {
        fontSize: 15,
        marginLeft: 5,
        marginTop: 10,
        fontWeight: '700',
        paddingHorizontal: 3
    },
    favorite: {
        borderRightWidth: 1,
        borderRightColor: 'grey',
        paddingRight: 40,
        marginLeft: 5
    },
    price: {
        borderRightWidth: 1,
        borderRightColor: 'grey',
        paddingRight: 25,
        marginLeft: 10
    },
    category: {
        marginLeft: 10,
        marginRight: 5
    },
    itemName: {
        color: 'grey',
        fontWeight: '700'
    },
    categoryName: {
        marginTop: 5,
        fontWeight: '700'
    },
    menuName: {
        marginTop: 5,
        fontWeight: '700'
    },
    tinyLogo: {
        width: 80,
        height: 80,
    },
    logo: {
        width: 66,
        height: 58,
    },
});
