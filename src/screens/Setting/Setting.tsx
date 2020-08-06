import React, { useState } from 'react';
import { View, FlatList, SafeAreaView, TouchableOpacity, Text, Linking } from 'react-native';
import { Icon } from 'react-native-elements'
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { styles } from './style'
//@ts-ignore
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { ContainerProps, ProfileStackNavProps, ItemProps } from 'src/types/types';
import { logout } from './index'

const Setting:React.FC<ProfileStackNavProps<'setting'> & ContainerProps> = (props) => {
    const [_dialogVisible, setDialogVisible] = useState<boolean>(false)

const Item = (props:ItemProps) => {
    return (
        <View>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => props.itemMethod()}>
                <Icon containerStyle={styles.icon} name={props.iconName} type='font-awesome'/>
                <Text style={styles.itemName}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const changeUserName = () => {
    props.navigation.navigate('nameEditor')
}
const showAppTerm = () => {
    (() => Linking.openURL('https://tomosume.flycricket.io/privacy.html'))();
}

const itemList = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'ユーザー名変更',
        icon: 'user-o',
        method: changeUserName
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'プライバシーポリシー',
        icon: 'book',
        method: showAppTerm
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'ログアウト',
        icon: 'sign-out',
        method: () => setDialogVisible(true)
    },
]
    return (
        <>
        <View>
            <ConfirmDialog
                visible={_dialogVisible}
                title="確認画面"
                onTouchOutside={() => setDialogVisible(false)}
                positiveButton={{
                    title: "はい",
                    onPress: () => logout(props)
                }}
                negativeButton={{
                    title: "いいえ",
                    onPress: () => setDialogVisible(false)
                }}
                >
            <View>
                <Text style={{textAlign: 'center'}}>本当にログアウトしますか？</Text>
            </View>
        </ConfirmDialog>
        </View>
        <SafeAreaView style={styles.container}>
            <FlatList
                data={itemList}
                renderItem={({ item }) => (
                    <Item
                        title={item.title}
                        iconName={item.icon}
                        itemMethod={item.method}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
        </>
    );
}

export const SettingWrapper:React.FC<ProfileStackNavProps<'setting'>> = ({ navigation }) => {
    return (
        <Subscribe to={[GlobalContainer]}>
            {
                (globalState:GlobalContainer) => <Setting globalState={globalState} navigation = {navigation} />
            }
        </Subscribe>
    );
}

