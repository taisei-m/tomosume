import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, } from 'react-native-elements'

interface ItemProps {
    shopName: string
    shopAddress: string
    category: string
    favorite: string
    price: number
}

const Item = (props: ItemProps) => {
    return (
        <View style={styles.container}>
            <Card containerStyle={styles.card}>
                        <View>
                            <Text style={{ color: 'grey', marginLeft: 5}}>店名</Text>
                            <Text style={styles.shopNameStyle}>{props.shopName}</Text>
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
            </Card>
        </View>
    );
}
export default Item

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 25,
        width: '95%'
    },
    shopName: {
        fontSize: 18,
        marginLeft: 5,
        marginTop: 10,
        fontWeight: '700'
    },
    shopNameStyle: {
        fontSize: 18,
        paddingLeft: 5,
        marginTop: 10,
        fontWeight: '700',
    },
    shopAddress: {
        fontSize: 15,
        paddingLeft: 5,
        marginTop: 10,
        fontWeight: '700'
    },
    favorite: {
        borderRightWidth: 1,
        borderRightColor: 'grey',
        flex: 2,
        paddingRight: 5
    },
    price: {
        borderRightWidth: 1,
        borderRightColor: 'grey',
        flex: 1,
        paddingHorizontal: 5
    },
    category: {
        flex: 1,
        paddingLeft: 5
    },
    itemName: {
        color: 'grey',
        fontWeight: '700',
        fontSize: 13
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
