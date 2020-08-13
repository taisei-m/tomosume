import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Subscribe } from 'unstated';
import GlobalContainer from '../../store/GlobalState';
import { styles } from './style';
import { ContainerProps, ProfileStackNavProps } from '../../types/types';
import { fetchUserDescription, updateUserName } from './index';

const NameEditor:React.FC<ProfileStackNavProps<'nameEditor'> & ContainerProps> = (props) => {
	const [_userName, setUserName] = useState<string>('');

	useEffect(() => {
		(async() => {
			const userDescription = await fetchUserDescription(props.globalState.state.uid);
			setUserName(userDescription.userName);
		})();
	}, []);

	const changeName = () => {
		updateUserName(props.globalState.state.uid, _userName);
		props.navigation.navigate('ProfileWrapper');
	};

	return (
		<View style={styles.container}>
			<View style={{flexDirection: 'row', justifyContent: 'center'}}>
				<TextInput
					defaultValue={_userName}
					style={styles.textInput}
					onChangeText={setUserName}
				/>
				<TouchableOpacity
					style={styles.button}
					onPress={changeName}>
					<Text>変更</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export const NameEditorWrapper:React.FC<ProfileStackNavProps<'nameEditor'>> = ({ navigation }) => {
	return (
		<Subscribe to={[GlobalContainer]}>
			{
				(globalState:GlobalContainer) => <NameEditor globalState={globalState} navigation = {navigation} />
			}
		</Subscribe>
	);
};

