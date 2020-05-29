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
    price: string
    userId?: string
    pressMethod: Function
}


const Item = (props: ItemProps) => {
    return (
        <View style={styles.listItem}>
            <Card containerStyle={{borderRadius: 25}}>
                <TouchableOpacity  onPress={() => props.pressMethod()}>
                    <View style={styles.userInfomation}>
                        <Avatar rounded source={{ uri: props.iconURL }}/>
                        <Text style={styles.userName}>{props.userName}</Text>
                    </View>
                </TouchableOpacity>
                    <View style={{flexDirection: 'row'}}>
                        <View>
                            <Text style={{ color: 'grey', marginLeft: 5}}>Shop Name</Text>
                            <Text style={styles.shopName}>{props.title}</Text>
                            <Text style={{ color: 'grey', marginLeft: 5, marginTop: 5}}>Shop Address</Text>
                            <Text style={styles.shopAddress}>{props.address}</Text>
                            <View style={{flexDirection: 'row', marginTop: 10,}}>
                                <View style={styles.favorite}>
                                    <Text style={styles.itemName}>Favorite Menu</Text>
                                    <Text style={styles.menuName}>{props.favorite}</Text>
                                </View>
                                <View style={styles.price}>
                                    <Text style={styles.itemName}>Price</Text>
                                    <Text style={styles.menuName}>{props.price}</Text>
                                </View>
                                <View style={styles.category}>
                                    <Text style={styles.itemName}>Category</Text>
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
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    card: {
        borderRadius: 10
    },
    listItem: {
        marginTop: 10,
        marginBottom: 10,
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
        marginLeft: 5,
        marginTop: 10,
        fontWeight: '700'
    },
    shopAddress: {
        fontSize: 15,
        marginLeft: 5,
        marginTop: 10,
        fontWeight: '700'
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
        paddingRight: 40,
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
