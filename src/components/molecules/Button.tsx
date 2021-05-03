import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../atoms/Text';

type Props = {
	onPress: () => void;
	disabled: boolean;
	color?: string | undefined;
};

export const Button: React.FC<Props> = ({ color, disabled, onPress, children }) => {
	return (
		<TouchableOpacity
			style={[styles.btn, color === 'lightgrey' && styles.lightgreyBtn]}
			disabled={disabled}
			onPress={onPress}>
			<Text textAlign="center" color="white" weight="700">
				{children}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	btn: {
		position: 'relative',
		width: '100%',
		paddingVertical: 18,
		paddingHorizontal: 16,
		borderRadius: 40,
		backgroundColor: '#fbd01d',
	},
	lightgreyBtn: {
		backgroundColor: 'lightgrey',
	},
});
