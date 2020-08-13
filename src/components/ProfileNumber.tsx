import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';

interface ProfileNumberProps {
    number: number
    press?: () => void
    itemName: string
    centerClass?: object
}

const ProfileNumber = (props: ProfileNumberProps) => {
	return(
		<View style={props.centerClass}>
			<TouchableOpacity onPress={props.press}>
				<Text
					style={styles.number}
				>{props.number}</Text>
				<Text style={styles.numberKey}>{props.itemName}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ProfileNumber;

const styles = StyleSheet.create({
	number: {
		fontSize: 28,
		textAlign: 'center'
	},
	numberKey: {
		fontSize: 12,
		textAlign: 'center',
		color: '#818181'
	},
});