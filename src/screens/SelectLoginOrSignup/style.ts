import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	keyboardScrollView: {
		flex: 1,
		backgroundColor: 'white',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		// justifyContent: 'center',
	},
	topTitle: {
		fontWeight: 'bold',
		fontSize: 50,
		color: 'black',
		marginTop: '45%',
		marginBottom: '20%',
	},
	button: {
		width: '80%',
	},
	gotoSignupButton: {
		backgroundColor: '#5E9CFE',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
	},
	gotoLoginText: {
		// color: '#818181',
		color: 'black',
		textDecorationLine: 'underline',
		marginTop: '10%',
	},
});