import React, { useState } from 'react';
import { View, FlatList, SafeAreaView, TouchableOpacity, Text, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { styles } from './style';
//@ts-ignore
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { ContainerProps, ProfileStackNavProps, ItemProps } from '../../types/types';
import { logout } from './index';
import {
	Button,
	AlertDialog,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
} from '@chakra-ui/react';

const Setting: React.FC<ProfileStackNavProps<'setting'> & ContainerProps> = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const onClose = () => setIsOpen(false);
	//TODO:any
	const cancelRef = React.useRef<any>();

	const Item = (props: ItemProps) => {
		return (
			<View>
				<TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.itemMethod()}>
					<Icon containerStyle={styles.icon} name={props.iconName} type="font-awesome" />
					<Text style={styles.itemName}>{props.title}</Text>
				</TouchableOpacity>
			</View>
		);
	};

	const changeUserName = () => {
		props.navigation.navigate('nameEditor');
	};
	const showAppTerm = () => {
		(() => Linking.openURL('https://tomosume.flycricket.io/privacy.html'))();
	};

	const itemList = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: 'ユーザー名変更',
			icon: 'user-o',
			method: changeUserName,
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: 'プライバシーポリシー',
			icon: 'book',
			method: showAppTerm,
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29d72',
			title: 'ログアウト',
			icon: 'sign-out',
			method: () => setIsOpen(true),
		},
	];
	return (
		<>
			<View>
				<>
					<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
						<AlertDialogOverlay>
							<AlertDialogContent>
								<AlertDialogHeader fontSize="lg" fontWeight="bold">
									本当にログアウトしますか？
								</AlertDialogHeader>
								<AlertDialogFooter>
									<Button onClick={onClose}>いいえ</Button>
									<Button colorScheme="red" onClick={() => logout(props)} ml={3}>
										はい
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
				</>
			</View>
			<SafeAreaView style={styles.container}>
				<FlatList
					data={itemList}
					renderItem={({ item }) => (
						<Item title={item.title} iconName={item.icon} itemMethod={item.method} />
					)}
					keyExtractor={(item) => item.id}
				/>
			</SafeAreaView>
		</>
	);
};

export const SettingWrapper: React.FC<ProfileStackNavProps<'setting'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{(globalState: GlobalContainer) => (
				<Setting globalState={globalState} navigation={navigation} />
			)}
		</Subscribe>
	);
};
