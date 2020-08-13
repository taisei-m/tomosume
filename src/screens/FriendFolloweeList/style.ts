import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 0,
		backgroundColor: 'white',
	},
	cell: {
		flexDirection: 'row',
		borderStyle: 'solid',
		borderWidth: 0.5,
		borderColor: '#f5f5f5',
		height: 50,
	},
	text: {
		fontSize: 18,
		marginLeft: 15,
		marginTop: 15,
	},
});
