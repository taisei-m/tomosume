import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { Avatar, Card, } from 'react-native-elements'

interface ItemProps {
    id: string
    userName?: string,
    iconURL?: string
    title?: string
    address?: string
    category: string
    favorite: string
    price: number
    userId?: string
    pressMethod: Function
}

const Item = (props: ItemProps) => {
    return (
        <View style={styles.container}>
            <Card containerStyle={styles.card}>
                <TouchableOpacity  onPress={() => props.pressMethod(props.userId)}>
                    <View style={styles.userInfomation}>
                        <Avatar rounded source={{ uri: props.iconURL }}/>
                        <Text style={styles.userName}>{props.userName}</Text>
                    </View>
                </TouchableOpacity>
                        <View>
                            <Text style={{ color: 'grey', marginLeft: 5}}>店名</Text>
                            <Text style={styles.shopName} numberOfLines={2}>{props.title}</Text>
                            <Text style={{ color: 'grey', marginLeft: 5, marginTop: 5}}>住所</Text>
                            <Text
                                style={styles.shopAddress}
                                numberOfLines={2}
                                >{props.address}</Text>
                            <View style={{flexDirection: 'row', marginTop: 10, flex: 1, paddingLeft: 5}}>
                                <View style={styles.favorite}>
                                    <Text style={styles.itemName}>おすすめメニュー</Text>
                                    <Text
                                        style={styles.menuName}
                                        numberOfLines={3}
                                    >{props.favorite}</Text>
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
        marginBottom: 7
    },
    card: {
        borderRadius: 25,
        width: '95%',
        shadowOpacity: 0.3,
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 3,
        elevation: 5
    },
    userInfomation: {
        flexDirection: 'row',
        marginBottom: 10
    },
    userName: {
        fontSize: 18,
        paddingTop: 5,
        paddingLeft: 10
    },
    shopName: {
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
    categoryName: {
        marginTop: 5,
        fontWeight: '700'
    },
    menuName: {
        marginTop: 5,
        fontWeight: '700'
    },
});
